import { IsObject } from "class-validator";
import { EventLink } from "@api/modules/events/entities";
import { Type } from "class-transformer";
import { OmitType, PartialType } from "@nestjs/swagger";

export class CreateEventLinkPartial extends OmitType(PartialType(EventLink), ["id", "event"]) {}

export class CreateEventLinkDto {
	@IsObject({ each: true })
	@Type(() => CreateEventLinkPartial)
	links: CreateEventLinkPartial[];
}
