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
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from "@nestjs/swagger";
import { isUUID } from "class-validator";
import { FormDataRequest } from "nestjs-form-data";

import { CookieGuard } from "modules/auth/providers/guards";
import { Event, EventsService } from "modules/events";
import { OrganizationService } from "modules/organization";
import { PhotoService } from "modules/photo";
import { Permission } from "modules/roles";
import type { User } from "modules/users";

import { Pagination, type PaginationOptions } from "utilities/nest/decorators";
import { CurrentUser } from "../decorators";
import { CreateEvent, UpdateEvent, UpdatePhoto } from "../models/requests";
import { EventSimple } from "../models/responses";

@ApiTags("Events")
@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly organizationService: OrganizationService,
    private readonly photoService: PhotoService
  ) {}

  /**
   * Find upcoming visible events
   */
  @ApiOkResponse({ type: [EventSimple] })
  @Get("upcoming")
  upcomingEvents(@Pagination() pagination: PaginationOptions) {
    return this.eventsService.getUpcomingEvents({ pagination, visible: true });
  }

  /**
   * Find event by ID or slug
   */
  @ApiOkResponse({ type: EventSimple, description: "Found event" })
  @ApiNotFoundResponse({ description: "Event not found" })
  @Get(":idOrSlug")
  async getEvent(@Param("idOrSlug") idOrSlug: string) {
    // Must be used different method for searching because postgres throws error if id is not UUID
    const event = await (isUUID(idOrSlug)
      ? this.eventsService.findById(idOrSlug, { visible: true })
      : this.eventsService.findBySlug(idOrSlug, { visible: true }));

    if (!event) throw new NotFoundException("Event not found");

    return event;
  }

  /**
   * Create new event
   *
   * Organization permissions required: `create.event`
   */
  @ApiCreatedResponse({ type: EventSimple, description: "Created event" })
  @ApiForbiddenResponse({
    description:
      "User is not member of event organization or does not have required permissions",
  })
  @ApiBearerAuth()
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
    event.visible = body.visible;
    event.registrationDeadline = body.registrationDeadline;
    event.registrationForm = body.registrationForm;
    event.capacity = body.capacity;

    event = await this.eventsService.save(event);
    event.createdBy = undefined;
    return event;
  }

  @ApiOkResponse({ type: EventSimple, description: "Updated event" })
  @ApiForbiddenResponse({
    description:
      "User is not member of event organization or does not have required permissions",
  })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Patch(":eventId")
  async updateEvent(
    @Param("eventId") eventId: string,
    @CurrentUser() user: User,
    @Body() body: UpdateEvent
  ) {
    const event = await this.eventsService.findById(eventId, { visible: true });
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

    Object.assign(event, body);
    return this.eventsService.save(event);
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
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @UseGuards(CookieGuard)
  @Patch(":eventId/photo")
  async updateEventPhoto(
    @Param("eventId") eventId: string,
    @CurrentUser() user: User,
    @Body() body: UpdatePhoto
  ) {
    const event = await this.eventsService.findById(eventId, { visible: true });
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
    await this.eventsService.save(event);
  }
}
