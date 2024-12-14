import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { EventsService } from "modules/events";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { ParseDatePipe } from "utilities/nest/pipes";
import { EventSimple } from "../../models/responses";

@ApiTags("Events [Management]")
@Controller("management/events")
export class EventsManagementController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Find all events including not published/visible events
   */
  @ApiQuery({ name: "sinceSince", required: false, type: Number })
  @ApiQuery({ name: "toSince", required: false, type: Number })
  @ApiOkResponse({ type: [EventSimple] })
  @Get()
  getManagementEvents(
    @Pagination() pagination: PaginationOptions,
    @Query("sinceSince", ParseDatePipe) since?: Date,
    @Query("toSince", ParseDatePipe) to?: Date
  ) {
    return this.eventsService.findByFilter({ to, since }, { pagination });
  }
}
