import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PhotoModule } from "modules/photo";
import { Event, EventApplication, EventSpot } from "./entities";
import { EventSpotsService, EventsService } from "./providers/services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventSpot, EventApplication]),
    PhotoModule,
  ],
  providers: [EventsService, EventSpotsService],
  exports: [EventsService, EventSpotsService],
})
export class EventsModule {}
