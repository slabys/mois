import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { MoreThan, type Repository } from "typeorm";

import { Event } from "modules/events/entities";
import { FindManyOptions } from "libs/types";

interface EventFindOptions extends FindManyOptions {
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
   * Find event by slug
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

    if (!newEvent.hasId()) {
      newEvent.slug = slugify(newEvent.title, {
        lower: true,
        trim: true,
      }).substring(0, 60);

      newEvent.slug = `${newEvent.slug}-${new Date().getTime()}`;
    }

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
      skip: options?.pagination?.skip,
      take: options?.pagination?.take,
    });
  }
}
