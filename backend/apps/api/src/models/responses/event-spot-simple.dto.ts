import { PickType } from "@nestjs/swagger";
import { EventSpot } from "modules/events/entities";

export class EventSpotSimple extends PickType(EventSpot, [
  "id",
  "capacity",
  "name",
  "price",
]) {}
