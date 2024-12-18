import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { CookieGuard } from "modules/auth/providers/guards";
import {
  EventApplicationsService,
  EventSpotsService,
  EventsService,
} from "modules/events";
import {
  EventApplication,
  EventCustomOrganization,
} from "modules/events/entities";
import { User, UsersService } from "modules/users";

import { Address } from "modules/addresses";
import { OrganizationService } from "modules/organization";
import { ajv } from "utilities/ajv";
import { ParseDatePipe } from "utilities/nest/pipes";
import { CurrentUser } from "../decorators";
import {
  CreateEventApplication,
  UpdateEventApplication,
} from "../models/requests";
import { EventApplicationSimple } from "../models/responses";
import { InvoiceService } from "modules/invoice";
import { firstValueFrom } from "rxjs";
import { FileStorageService } from "modules/file-storage";
import { InvoiceCurrency } from "modules/invoice/enums";
import { InvoiceItem } from "modules/invoice/entities";
import { PaymentSubject } from "modules/payments";

@ApiTags("Event applications")
@Controller("events")
export class EventApplicationsController {
  constructor(
    private readonly eventApplicationsService: EventApplicationsService,
    private readonly eventService: EventsService,
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly eventSpotsService: EventSpotsService,
    private readonly invoiceService: InvoiceService,
    private readonly fileStorageService: FileStorageService
  ) {}

  /**
   * Get all signed-in user applications
   *
   * For filtering look at {@link EventsController}
   */
  @ApiBearerAuth()
  @ApiQuery({ name: "sinceSince", required: false, type: Number })
  @ApiQuery({ name: "toSince", required: false, type: Number })
  @UseGuards(CookieGuard)
  @Get("applications")
  getUserApplications(
    @CurrentUser() user: User,
    @Query("sinceSince", ParseDatePipe) since?: Date,
    @Query("toSince", ParseDatePipe) to?: Date
  ) {
    return this.eventApplicationsService.findByUserIdDetailed(user.id, {
      filter: { to, since },
    });
  }

  /**
   * Gett all event user applications
   * @param eventId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get(":eventId/applications")
  async getEventApplications(@Param("eventId", ParseIntPipe) eventId: number) {
    return this.eventApplicationsService.findByEventIdDetailed(eventId);
  }

  /**
   * Create event application
   */
  @ApiCreatedResponse({
    type: EventApplicationSimple,
    description: "Created new application",
  })
  @ApiConflictResponse({
    description: "Event application for user already exist",
  })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Post(":eventId/applications")
  async createUserApplication(
    @CurrentUser() user: User,
    @Param("eventId", ParseIntPipe) eventId: number,
    @Body() body: CreateEventApplication
  ) {
    const exist = await this.eventApplicationsService.exist(eventId, user.id);
    if (exist) throw new ConflictException("Event application already exist");

    const currentUser = await this.usersService.findById(user.id, {
      relations: { personalAddress: true },
    });

    if (!currentUser.personalAddress)
      throw new ForbiddenException("User must have valid personal address");

    const application = new EventApplication({
      user,
      personalAddress: currentUser.personalAddress.copy(),
      invoiceAddress: new Address(body.invoiceAddress),
      idNumber: body.idNumber,
    });

    if (body.organization.type === "organization") {
      const member = await this.organizationService.findMemberByUserId(
        body.organization.id,
        user.id,
        { relations: { organization: true } }
      );

      if (!member) throw new BadRequestException("Invalid organization given");
      application.organization = member.organization;
    } else {
      application.customOrganization = new EventCustomOrganization({
        country: body.organization.country,
        name: body.organization.name,
      });
    }

    const event = await this.eventService.findById(eventId, {
      relations: { spotTypes: true },
      select: { registrationForm: {}, id: true },
    });
    if (!event) throw new NotFoundException("Event not found");

    application.event = event;

    if (body.spotTypeId) {
      const spotType = event.spotTypes.find((e) => e.id === body.spotTypeId);
      if (!spotType) throw new NotFoundException("Spot type not found");

      application.spotType = spotType;
    }

    if (event.registrationForm) {
      const isFormValid = await ajv.validate(
        event.registrationForm,
        body.additionalFormData
      );

      if (!isFormValid)
        throw new BadRequestException("Registration form data are not valid");

      application.additionalData = body.additionalFormData;
    }

    // Hard-coded invoice
    const invoice = await this.invoiceService.create({
      constantSymbol: 123,
      currency: application?.invoice?.currency ?? InvoiceCurrency.CZK,
      iban: "CZ6508000000192000145399",
      items: application.spotType
        ? [
            new InvoiceItem({
              amount: 1,
              name: `Spot: ${application.spotType.name}`,
              price: application.spotType.price,
            }),
          ]
        : [],
      swift: "SWIFT",
      subscriber: new PaymentSubject({
        address: currentUser.personalAddress.copy(),
        name: "Subscriber",
      }),
      supplier: new PaymentSubject({
        address: new Address({
          city: "CITY",
          country: "Czech Republic",
          houseNumber: "50/7",
          street: "STREET",
          zip: "111 10",
        }),
        name: "SUPPLIER",
      }),
      variableSymbol: 123,
    });
    application.invoice = invoice;

    return this.eventApplicationsService.save(application);
  }

  /**
   * Update event application
   *
   * @param applicationId Event Application ID
   * @returns
   */
  @ApiCreatedResponse({
    type: EventApplicationSimple,
    description: "Update event application",
  })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Patch("application/:id")
  async updateEventApplication(
    @Param("id", ParseIntPipe) applicationId: number,
    @Body() body: UpdateEventApplication
  ) {
    const application = await this.eventApplicationsService.findById(
      applicationId,
      {
        relations: {
          personalAddress: true,
          event: true,
        },
      }
    );
    if (!application)
      throw new NotFoundException("Event application not found");

    if (body.spotTypeId) {
      const eventSpot = await this.eventSpotsService.findById(body.spotTypeId);
      if (!eventSpot) throw new BadRequestException("Invalid event spot");

      application.spotType = eventSpot;
    }
    if (body.spotTypeId === null) application.spotType = null;

    if (body.invoiceAddress)
      application.personalAddress.update(body.invoiceAddress);

    application.idNumber = body.idNumber ?? application.idNumber;

    if (body.additionalFormData) {
      const event = await this.eventService.findById(application.event.id, {
        relations: { spotTypes: true },
        select: { registrationForm: {}, id: true },
      });
      if (!event) throw new NotFoundException("Event not found");

      if (event.registrationForm) {
        const isFormValid = await ajv.validate(
          event.registrationForm,
          body.additionalFormData
        );

        if (!isFormValid)
          throw new BadRequestException("Registration form data are not valid");

        application.additionalData = body.additionalFormData;
      }
    }

    return this.eventApplicationsService.save(application);
  }

  /**
   * Delete event application by ID
   */
  @ApiOkResponse({ description: "Event application deleted" })
  @ApiNotFoundResponse({ description: "Event application not found" })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Delete("application/:id")
  async deleteEventApplication(
    @Param("id", ParseIntPipe) applicationId: number
  ) {
    const application = await this.eventApplicationsService.findById(
      applicationId
    );
    if (!application)
      throw new NotFoundException("Event application not found");

    await this.eventApplicationsService.delete(application);
  }

  @ApiOkResponse({ description: "Event application deleted" })
  @ApiNotFoundResponse({ description: "Event application not found" })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get("application/:id/invoice")
  async getEventApplicationInvoice(
    @Param("id", ParseIntPipe) applicationId: number
  ) {
    const application = await this.eventApplicationsService.findById(
      applicationId,
      {
        relations: {
          invoice: {
            subscriber: { address: true },
            supplier: { address: true },
          },
        },
      }
    );

    if (!application?.invoice) throw new NotFoundException("Invoice not found");

    const result = await this.invoiceService.generatePdfFromInvoice(
      application.invoice
    );
    const value = await firstValueFrom(result);

    if (value.success) {
      return {
        invoice: application.invoice,
        url: await this.fileStorageService.getPublicUrl(value.outputPath),
      };
    }
    throw new InternalServerErrorException("Could not generate invoice");
  }
}
