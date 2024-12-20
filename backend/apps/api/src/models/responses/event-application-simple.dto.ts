import { PickType } from "@nestjs/swagger";
import { EventApplication } from "modules/events/entities";
import type { EventSimple } from "./event-simple.dto";

export class EventApplicationSimple extends PickType(EventApplication, [
  "createdAt",
  "id",
  "spotType",
  "user",
]) {
  event: EventSimple;
}
