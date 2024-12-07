import {
  BadRequestException,
  Body,
  Controller,
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
import { User } from "modules/users";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

import { CurrentUser } from "../decorators";
import { CreateEventApplication } from "../models/requests";
import { EventApplicationSimple } from "../models/responses";
import { ajv } from "utilities/ajv";

@ApiTags("Event applications")
@Controller("events")
export class EventApplicationsController {
  constructor(
    private readonly eventApplicationsService: EventApplicationsService,
    private readonly eventService: EventsService
  ) {}

  /**
   * Get all user applications
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get("applications")
  getUserApplications(
    @CurrentUser() user: User,
    @Pagination() pagination: PaginationOptions
  ) {
    return this.eventApplicationsService.findByUserId(user.id, { pagination });
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
    const event = await this.eventService.findById(eventId, {
      relations: { spotTypes: true },
      select: { registrationForm: {} },
    });
    if (!event) throw new NotFoundException("Event not found");

    const spotType = event.spotTypes.find((e) => e.id === body.spotTypeId);
    if (!spotType) throw new NotFoundException("Spot type not found");

    const application = new EventApplication({
      event,
      user,
      spotType,
    });

    if (event.registrationForm) {
      const schema = await ajv.compileAsync(event.registrationForm);
      const isFormValid = schema(body.additionalFormData);

      if (!isFormValid)
        throw new BadRequestException("Registration form data are not valid");

      application.additionalData = body.additionalFormData;
    }

    return this.eventApplicationsService.save(application);
  }
}
