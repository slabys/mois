import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "modules/events/entities";
import slugify from "slugify";
import { Repository } from "typeorm";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) {}

  save(event: Partial<Event>) {
    const newEvent = new Event(event);

    if (!newEvent.hasId())
      newEvent.slug = slugify(newEvent.title, {
        lower: true,
        trim: true,
      }).substring(0, 60);

    return this.eventsRepository.save(newEvent);
  }
}
