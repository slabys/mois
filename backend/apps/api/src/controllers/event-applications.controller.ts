import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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

import { ajv } from "utilities/ajv";
import { CurrentUser } from "../decorators";
import {
  CreateEventApplication,
  UpdateEventApplication,
} from "../models/requests";
import { EventApplicationSimple } from "../models/responses";
import { Address } from "modules/addresses";
import { OrganizationService } from "modules/organization";

@ApiTags("Event applications")
@Controller("events")
export class EventApplicationsController {
  constructor(
    private readonly eventApplicationsService: EventApplicationsService,
    private readonly eventService: EventsService,
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly eventSpotsService: EventSpotsService
  ) {}

  /**
   * Get all signed-in user applications
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get("applications")
  getUserApplications(@CurrentUser() user: User) {
    return this.eventApplicationsService.findByUserIdDetailed(user.id);
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
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Post(":eventId/applications")
  async createUserApplication(
    @CurrentUser() user: User,
    @Param("eventId", ParseIntPipe) eventId: number,
    @Body() body: CreateEventApplication
  ) {
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
    @Param("id") applicationId: string,
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
  async deleteEventApplication(@Param("id") applicationId: string) {
    const application = await this.eventApplicationsService.findById(
      applicationId
    );
    if (!application)
      throw new NotFoundException("Event application not found");

    await this.eventApplicationsService.delete(application);
  }
}
