import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "modules/events/entities";
import slugify from "slugify";
import { MoreThan, type Repository } from "typeorm";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) {}

  /**
   * Find event by ID
   * @param id Event ID
   * @returns
   */
  findById(id: string) {
    return this.eventsRepository.findOne({
      where: { id },
      relations: {
        createdBy: {
          organization: true,
        },
      },
    });
  }

  /**
   * Find event by ID or slug
   * @param idOrSlug ID or slug
   * @returns Event or null
   */
  findByIdOrSlug(idOrSlug: string) {
    return this.eventsRepository.findOne({
      where: [
        {
          id: idOrSlug,
        },
        {
          slug: idOrSlug,
        },
      ],
      relations: {
        createdBy: {
          organization: true,
        },
      },
    });
  }

  save(event: Partial<Event>) {
    const newEvent = new Event(event);

    if (!newEvent.hasId())
      newEvent.slug = slugify(newEvent.title, {
        lower: true,
        trim: true,
      }).substring(0, 60);

    return this.eventsRepository.save(newEvent);
  }

  /**
   * TODO: Add pagination
   * All upcoming events
   * @returns {Event[]} Events
   */
  getUpcomingEvents() {
    return this.eventsRepository.find({
      where: {
        since: MoreThan(new Date()),
      },
      relations: {
        createdBy: {
          organization: true,
          user: {
            photo: true,
          },
        },
        photo: true,
      },
      order: {
        since: "DESC",
      },
    });
  }
}
