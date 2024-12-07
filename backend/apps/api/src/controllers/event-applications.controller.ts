import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { CookieGuard } from "modules/auth/providers/guards";
import { EventApplicationsService, EventsService } from "modules/events";
import { EventApplication } from "modules/events/entities";
import { User, UsersService } from "modules/users";

import { ajv } from "utilities/ajv";
import { CurrentUser } from "../decorators";
import { CreateEventApplication } from "../models/requests";
import { EventApplicationSimple } from "../models/responses";
import { Address } from "modules/addresses";

@ApiTags("Event applications")
@Controller("events")
export class EventApplicationsController {
  constructor(
    private readonly eventApplicationsService: EventApplicationsService,
    private readonly eventService: EventsService,
    private readonly usersService: UsersService
  ) {}

  /**
   * Get all signed-in user applications
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get("applications")
  getUserApplications(@CurrentUser() user: User) {
    return this.eventApplicationsService.findByUserId(user.id);
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
    return this.eventApplicationsService.findByEventId(eventId);
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

    const event = await this.eventService.findById(eventId, {
      relations: { spotTypes: true },
      select: { registrationForm: {}, id: true },
    });
    if (!event) throw new NotFoundException("Event not found");

    const spotType = event.spotTypes.find((e) => e.id === body.spotTypeId);
    if (!spotType) throw new NotFoundException("Spot type not found");

    const application = new EventApplication({
      event,
      user,
      spotType,
      personalAddress: currentUser.personalAddress.copy(),
      invoiceAddress: new Address(body.invoiceAddress),
    });

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
}
