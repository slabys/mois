import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Event } from "./entities";
import { EventsService } from "./providers/services";
import { PhotoModule } from "modules/photo";

@Module({
  imports: [TypeOrmModule.forFeature([Event]), PhotoModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
