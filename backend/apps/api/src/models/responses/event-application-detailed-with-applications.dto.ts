import { PickType, IntersectionType } from "@nestjs/swagger";
import { EventApplication } from "modules/events/entities";
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
]) {}

export class EventApplicationDetailedWithApplications extends IntersectionType(
  EventApplicationSimpleWithApplications,
  EventApplicationDetailed
) {}
