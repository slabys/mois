import {
  Body,
  Controller,
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
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

import { CookieGuard } from "modules/auth/providers/guards";
import { Event, EventsService } from "modules/events";
import { PhotoService } from "modules/photo";
import type { User } from "modules/users";
import { Pagination, type PaginationOptions } from "utilities/nest/decorators";

import { CurrentUser } from "../decorators";
import { CreateEvent, UpdateEvent, UpdatePhoto } from "../models/requests";
import { EventSimple } from "../models/responses";

import { ParseDatePipe } from "utilities/nest/pipes";

@ApiTags("Events")
@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly photoService: PhotoService
  ) {}

  /**
   * To filter by `since` use:
   * 
   * `sinceSince`: Events with `since` more than entered value 
   * 
   * `toSince`: Events with `since` less than entered value
   * 
   * 
   * Examples:
   * - To filter only future events use `sinceSince` `(new Date().getTime())`
   * - To filter only past events use `toSince` `(new Date().getTime())`
   * - To filter only events between two dates use `sinceSince`: `dateA`, `toSince`: `dateB`
   * 
   */
  @ApiOkResponse({ type: [EventSimple] })
  @ApiQuery({ name: "sinceSince", required: false, type: Number })
  @ApiQuery({ name: "toSince", required: false, type: Number })
  @Get()
  getEvents(
    @Pagination() pagination: PaginationOptions,
    @Query("sinceSince", ParseDatePipe) since?: Date,
    @Query("toSince", ParseDatePipe) to?: Date
  ) {
    return this.eventsService.findByFilter(
      { since, to },
      {
        pagination,
        visible: true,
      }
    );
  }

  /**
   * Find event by ID or slug
   */
  @ApiOkResponse({ type: EventSimple, description: "Found event" })
  @ApiNotFoundResponse({ description: "Event not found" })
  @Get(":id")
  async getEvent(@Param("id", ParseIntPipe) id: number) {
    const event = await this.eventsService.findById(id, { visible: true });
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
  @Post()
  async createEvent(@CurrentUser() user: User, @Body() body: CreateEvent) {
    // TODO: Check user role for modifications

    const event = new Event();
    event.title = body.title;
    event.longDescription = body.longDescription;
    event.shortDescription = body.shortDescription;
    event.since = body.since;
    event.until = body.until;
    event.createdByUser = user;
    event.visible = body.visible;
    event.registrationDeadline = body.registrationDeadline;
    event.registrationForm = body.registrationForm;
    event.capacity = body.capacity;
    event.codeOfConductLink = body.codeOfConductLink;
    event.photoPolicyLink = body.photoPolicyLink;
    event.termsAndConditionsLink = body.termsAndConditionsLink;

    return this.eventsService.save(event);
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
    @Param("eventId", ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
    @Body() body: UpdateEvent
  ) {
    // TODO: Check user role for modifications

    const event = await this.eventsService.findById(eventId, { visible: true });
    if (!event) throw new NotFoundException("Event not found");

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
    @Param("eventId", ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
    @Body() body: UpdatePhoto
  ) {
    // TODO: Check user role for modifications

    const event = await this.eventsService.findById(eventId, { visible: true });
    if (!event) throw new NotFoundException("Event not found");

    const photo = await this.photoService.save(body.file.buffer, "event_photo");
    if (!photo) new InternalServerErrorException("Could not save photo");

    event.photo = photo;
    await this.eventsService.save(event);
  }
}
