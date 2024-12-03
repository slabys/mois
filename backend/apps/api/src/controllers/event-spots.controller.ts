import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { EventSpotsService, EventsService } from "modules/events";
import { EventSpotSimple } from "../models/responses";
import { CookieGuard } from "modules/auth/providers/guards";
import {
  CreateEventSpot,
  DeleteEventSpot,
  UpdateEventSpot,
} from "../models/requests";
import { OrganizationService } from "modules/organization";
import { CurrentUser } from "../decorators";
import { User } from "modules/users";
import { Permission } from "modules/roles";
import { EventSpot } from "modules/events/entities";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

const ApiEventIdParam = () => ApiParam({ name: "id", description: "Event ID" });

@ApiTags("Event spots")
@Controller()
export class EventSpotsController {
  constructor(
    private readonly eventSpotsService: EventSpotsService,
    private readonly eventsService: EventsService,
    private readonly organizationsService: OrganizationService
  ) {}

  /**
   * Find event spots for event
   */
  @ApiOkResponse({
    type: [EventSpotSimple],
    description: "Available event spots",
  })
  @ApiEventIdParam()
  @Get("events/:id/spots")
  getEventSpots(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Pagination() pagination: PaginationOptions
  ) {
    return this.eventSpotsService.findByEventId(eventId, { pagination });
  }

  /**
   * Create new event spot
   */
  @ApiForbiddenResponse({
    description:
      "Not member of organization or missing `CreateEvent` permission",
  })
  @ApiNotFoundResponse({ description: "Event not found" })
  @ApiCreatedResponse({
    type: EventSpotSimple,
    description: "Created event spot",
  })
  @ApiEventIdParam()
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Post("events/:id/spots")
  async createEventSpot(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Body() body: CreateEventSpot,
    @CurrentUser() user: User
  ) {
    const event = await this.eventsService.findById(eventId);
    if (!event) throw new NotFoundException("Event not found");

    const { organization } = event.createdBy;

    const member = await this.organizationsService.findMemberByUserId(
      organization.id,
      user.id
    );

    if (!member) throw new ForbiddenException("Not member of organization");
    if (member.hasPermission(Permission.CreateEvent))
      throw new ForbiddenException("Missing required permissions");

    const spot = new EventSpot({
      capacity: body.capacity,
      event,
      name: body.name,
      price: body.price,
    });
    return this.eventSpotsService.save(spot);
  }

  @ApiForbiddenResponse({
    description:
      "Not member of organization or missing `CreateEvent` permission",
  })
  @ApiNotFoundResponse({ description: "Event spot not found" })
  @ApiOkResponse({ description: "Event spot deleted" })
  @ApiParam({ name: "id", description: "Event spot ID" })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Delete("events/spots/:id")
  async deleteEventSpot(
    @Param("id", ParseUUIDPipe) eventSpotId: string,
    @Body() body: DeleteEventSpot,
    @CurrentUser() user: User
  ) {
    const eventSpot = await this.eventSpotsService.findById(eventSpotId);
    if (!eventSpot) throw new NotFoundException("Event spot not found");

    const { organization } = eventSpot.event.createdBy;

    const member = await this.organizationsService.findMemberByUserId(
      organization.id,
      user.id
    );

    if (!member) throw new ForbiddenException("Not member of organization");
    if (member.hasPermission(Permission.CreateEvent))
      throw new ForbiddenException("Missing required permissions");

    if (body.replaceWithSpotId) {
      const replaceWithSpot = await this.eventSpotsService.findById(
        body.replaceWithSpotId
      );
      if (!replaceWithSpot)
        throw new NotFoundException("Event spot replacement not found");

      // Event spot is for different event
      if (replaceWithSpot.event.id !== eventSpot.event.id)
        throw new BadRequestException("Event spot replacement is invalid");

      await this.eventSpotsService.delete(eventSpot, replaceWithSpot);
      return;
    }

    await this.eventSpotsService.delete(eventSpot);
  }

  @ApiForbiddenResponse({
    description:
      "Not member of organization or missing `CreateEvent` permission",
  })
  @ApiNotFoundResponse({ description: "Event spot not found" })
  @ApiOkResponse({ type: EventSpotSimple, description: "Event spot updated" })
  @ApiParam({ name: "id", description: "Event spot ID" })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Patch("events/spots/:id")
  async updateEventSpot(
    @Param("id", ParseUUIDPipe) eventSpotId: string,
    @Body() body: UpdateEventSpot,
    @CurrentUser() user: User
  ) {
    const eventSpot = await this.eventSpotsService.findById(eventSpotId);
    if (!eventSpot) throw new NotFoundException("Event spot not found");

    const { organization } = eventSpot.event.createdBy;

    const member = await this.organizationsService.findMemberByUserId(
      organization.id,
      user.id
    );

    if (!member) throw new ForbiddenException("Not member of organization");
    if (member.hasPermission(Permission.CreateEvent))
      throw new ForbiddenException("Missing required permissions");

    eventSpot.name = body.name ?? eventSpot.name;
    eventSpot.capacity = body.capacity ?? eventSpot.capacity;
    eventSpot.price = body.price ?? eventSpot.price;

    return this.eventsService.save(eventSpot);
  }
}
