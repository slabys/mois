import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CookieGuard } from "modules/auth/providers/guards";
import { EventApplicationsService, EventsService } from "modules/events";
import { CurrentUser } from "../decorators";
import { User } from "modules/users";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { CreateEventApplication } from "../models/requests";
import { EventApplication } from "modules/events/entities";
import { EventApplicationSimple } from "../models/responses";

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
  @UseGuards()
  @Post(":eventId/applications")
  async createUserApplication(
    @CurrentUser() user: User,
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Body() body: CreateEventApplication
  ) {
    const event = await this.eventService.findById(eventId);
    if (!event) throw new NotFoundException("Event not found");

    const spotType = event.spotTypes.find((e) => e.id === body.spotTypeId);
    if (!spotType) throw new NotFoundException("Spot type not found");

    const application = new EventApplication({
      event,
      user,
      spotType,
    });

    return this.eventApplicationsService.save(application);
  }
}
