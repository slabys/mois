import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CookieGuard } from "modules/auth/providers/guards";
import { EventSpotsService, EventsService } from "modules/events";
import { EventSpot } from "modules/events/entities";
import { User } from "modules/users";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { CurrentUser } from "../decorators";
import {
  CreateEventSpot,
  DeleteEventSpot,
  UpdateEventSpot,
} from "../models/requests";
import { EventSpotSimple } from "../models/responses";

const ApiEventIdParam = () => ApiParam({ name: "id", description: "Event ID" });

@ApiTags("Event spots")
@Controller()
export class EventSpotsController {
  constructor(
    private readonly eventSpotsService: EventSpotsService,
    private readonly eventsService: EventsService
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
    @Param("id", ParseIntPipe) eventId: number,
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
    @Param("id", ParseIntPipe) eventId: number,
    @Body() body: CreateEventSpot,
    @CurrentUser() user: User
  ) {
    // TODO: Check user role for modifications

    const event = await this.eventsService.findById(eventId);
    if (!event) throw new NotFoundException("Event not found");

    const spot = new EventSpot({
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
    @Param("id", ParseIntPipe) eventSpotId: number,
    @Body() body: DeleteEventSpot,
    @CurrentUser() user: User
  ) {
    // TODO: Check user role for modifications

    const eventSpot = await this.eventSpotsService.findById(eventSpotId);
    if (!eventSpot) throw new NotFoundException("Event spot not found");

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
    @Param("id", ParseIntPipe) eventSpotId: number,
    @Body() body: UpdateEventSpot,
    @CurrentUser() user: User
  ) {
    // TODO: Check user role for modifications

    const eventSpot = await this.eventSpotsService.findById(eventSpotId);
    if (!eventSpot) throw new NotFoundException("Event spot not found");

    eventSpot.name = body.name ?? eventSpot.name;
    eventSpot.price = body.price ?? eventSpot.price;

    return this.eventSpotsService.save(eventSpot);
  }
}
