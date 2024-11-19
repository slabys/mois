import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CookieGuard } from "modules/auth/providers/guards";
import { Event, EventsService } from "modules/events";
import { OrganizationService } from "modules/organization";
import { PhotoService } from "modules/photo";
import { Permission } from "modules/roles";
import { User } from "modules/users";
import { FormDataRequest } from "nestjs-form-data";
import { CurrentUser } from "../decorators";
import { CreateEvent, UpdatePhoto } from "../models/requests";

@ApiTags("Events")
@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly organizationService: OrganizationService,
    private readonly photoService: PhotoService
  ) {}

  @Get("upcoming")
  upcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  /**
   * Create new event
   *
   * Organization permissions required: `create.event`
   */
  @ApiForbiddenResponse({
    description:
      "User is not member of event organization or does not have required permissions",
  })
  @ApiCookieAuth()
  @UseGuards(CookieGuard)
  @Post(":organizationId")
  async createEvent(
    @Param("organizationId") organizationId: string,
    @CurrentUser() user: User,
    @Body() body: CreateEvent
  ) {
    const membership = await this.organizationService.findMemberByUserId(
      organizationId,
      user.id
    );
    if (!membership)
      throw new ForbiddenException("You are not member of organization");

    if (!membership.hasPermission(Permission.CreateEvent))
      throw new ForbiddenException(
        "You dont have permission to create new event"
      );

    let event = new Event();
    event.title = body.title;
    event.description = body.description;
    event.since = body.since;
    event.until = body.until;
    event.createdBy = membership;

    event = await this.eventsService.save(event);
    event.createdBy = undefined;
    return event;
  }

  /**
   * Update event photo
   * Organization permissions required: `create.event`
   */
  @ApiForbiddenResponse({
    description:
      "User is not member of event organization or does not have required permissions",
  })
  @ApiNotFoundResponse({ description: "Event not found" })
  @ApiCookieAuth()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @UseGuards(CookieGuard)
  @Patch(":eventId")
  async updateEventPhoto(
    @Param("eventId") eventId: string,
    @CurrentUser() user: User,
    @Body() body: UpdatePhoto
  ) {
    const event = await this.eventsService.findById(eventId);
    if (!event) throw new NotFoundException("Event not found");

    const membership = await this.organizationService.findMemberByUserId(
      event.createdBy.organization.id,
      user.id
    );
    if (!membership)
      throw new ForbiddenException("You are not member of event organization");

    if (!membership.hasPermission(Permission.CreateEvent))
      throw new ForbiddenException(
        "You dont have permission to create new event"
      );

    const photo = await this.photoService.save(body.file.buffer, "event_photo");
    if (!photo) new InternalServerErrorException("Could not save photo");

    event.photo = photo;
    return this.eventsService.save(event);
  }
}
