import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PhotoModule } from "modules/photo";
import { Event, EventApplication, EventSpot } from "./entities";
import {
  EventApplicationsService,
  EventSpotsService,
  EventsService,
} from "./providers/services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventSpot, EventApplication]),
    PhotoModule,
  ],
  providers: [EventsService, EventSpotsService, EventApplicationsService],
  exports: [EventsService, EventSpotsService, EventApplicationsService],
})
export class EventsModule {}
