import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  MoreThan,
  type Repository,
} from "typeorm";

import { FindManyOptions } from "libs/types";
import { Event } from "modules/events/entities";
import { EventFilter } from "../../models";
import { filterSince } from "../../utilities";

interface EventFindOptions extends FindManyOptions {
  visible?: boolean;
  relations?: FindOptionsRelations<Event>;
  select?: FindOptionsSelect<Event>;
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
   * @param options Find options
   * @returns
   */
  findById(id: number, options?: EventFindOptions) {
    return this.eventsRepository.findOne({
      where: { id, visible: options?.visible },
      select: options?.select,
      relations: {
        createdByUser: true,
        ...(options?.relations ?? {}),
      },
    });
  }

  findByIdDetailed(id: number, options?: EventFindOptions) {
    return this.findById(id, {
      select: {
        id: true,
        capacity: true,
        codeOfConductLink: true,
        photoPolicyLink: true,
        termsAndConditionsLink: true,
        createdAt: true,
        longDescription: true,
        shortDescription: true,
        registrationDeadline: true,
        registrationForm: {} as never,
        since: true,
        until: true,
        title: true,
        visible: true,
      },
      relations: {
        createdByUser: true,
        links: true,
        spotTypes: true,
        photo: true,
      },
    });
  }

  save(event: Partial<Event>) {
    return this.eventsRepository.save(new Event(event));
  }

  /**
   * TODO: Add pagination
   * All upcoming visible events
   * @returns Events
   */
  getUpcomingEvents(options?: EventFindOptions) {
    return this.eventsRepository.find({
      where: {
        since: MoreThan(new Date()),
        visible: options.visible,
      },
      relations: {
        createdByUser: true,
      },
      order: {
        since: "DESC",
      },
      skip: options?.pagination?.skip,
      take: options?.pagination?.take,
    });
  }

  findByFilter(filter?: EventFilter, options?: EventFindOptions) {
    return this.eventsRepository.find({
      where: {
        ...filterSince(filter),
        visible: options?.visible,
      },
      relations: {
        createdByUser: true,
      },
      order: {
        since: "DESC",
      },
      skip: options?.pagination?.skip,
      take: options?.pagination?.take,
    });
  }
}
