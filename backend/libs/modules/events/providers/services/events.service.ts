import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "modules/events/entities";
import slugify from "slugify";
import { MoreThan, type Repository } from "typeorm";

interface EventFindOptions {
  visible?: boolean;
}

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
  findById(id: string, options?: EventFindOptions) {
    return this.eventsRepository.findOne({
      where: { id, visible: options?.visible },
      relations: {
        createdBy: {
          organization: true,
        },
      },
    });
  }

  /**
   * Find event by ID or slug
   * @param slug slug
   * @returns Event or null
   */
  findBySlug(slug: string, options?: EventFindOptions) {
    return this.eventsRepository.findOne({
      where: {
        slug,
        visible: options?.visible,
      },
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
   * All upcoming visible events
   * @returns {Event[]} Events
   */
  getUpcomingEvents(options?: EventFindOptions) {
    return this.eventsRepository.find({
      where: {
        since: MoreThan(new Date()),
        visible: options.visible,
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
