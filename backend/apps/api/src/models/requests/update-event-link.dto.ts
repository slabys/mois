import { EventLink } from "@api/modules/events/entities";
import { OmitType, PartialType } from "@nestjs/swagger";

export class UpdateEventLinkPartial extends OmitType(PartialType(EventLink), ["id", "event"]) {}
