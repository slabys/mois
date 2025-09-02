import { IntersectionType, PickType } from "@nestjs/swagger";
import { EventApplication } from "../../modules/events/entities";
import { EventApplicationSimpleWithApplications } from "./event-application-simple-with-applications.dto";

export class EventApplicationDetailed extends PickType(EventApplication, [
	"additionalData",
	"id",
	"createdAt",
	"idNumber",
	"customOrganization",
	"organization",
	"user",
	"spotType",
	"invoiceAddress",
	"invoiceMethod",
	"validUntil",
	"foodRestrictionAllergies",
	"healthLimitations",
	"additionalInformation",
	"invoicedTo",
]) {}

/**
 * Event applications with event
 */
export class EventApplicationDetailedWithApplications extends IntersectionType(
	EventApplicationDetailed,
	EventApplicationSimpleWithApplications,
) {}
