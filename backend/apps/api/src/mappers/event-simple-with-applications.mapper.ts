import type { Event } from "modules/events";
import type { EventSimpleWithApplications } from "../models/responses";

export class EventSimpleWithApplicationsMapper {
  map(event: Event[]): EventSimpleWithApplications[];
  map(event: Event): EventSimpleWithApplications;
  map(event: Event | Event[]) {
    if (Array.isArray(event)) return event.map(this.map);

    return <EventSimpleWithApplications>{
      ...event,
      applications: event.applications.length,
    };
  }
}
