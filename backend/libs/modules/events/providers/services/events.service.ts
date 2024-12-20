import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  type Repository,
} from "typeorm";

import { FindManyOptions } from "libs/types";
import { Event } from "modules/events/entities";
import { EventFilter } from "../../models";

interface EventFindOptions extends FindManyOptions {
  visible?: boolean;
  relations?: FindOptionsRelations<Event>;
  select?: FindOptionsSelect<Event>;
}

interface EventWithApplications extends Omit<Event, "applications"> {
  applications: number;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) {}

  /**
   * Create new query builder
   * @param options Filter options
   * @returns Query builder
   */
  private createQueryBuilder(options?: EventFindOptions) {
    const query = this.eventsRepository
      .createQueryBuilder("event")
      .setFindOptions(options)
      .loadRelationCountAndMap("event.applications", "event._applications");

    if (options.visible !== undefined)
      query.andWhere("event.visible = :visible", { visible: options.visible });

    query.take(options?.pagination?.take).skip(options?.pagination.skip);

    return query;
  }

  /**
   * Find event by ID
   * @param id Event ID
   * @param options Find options
   * @returns
   */
  findById(
    id: number,
    options?: EventFindOptions
  ): Promise<EventWithApplications> {
    return this.createQueryBuilder(options)
      .where("event.id = :id", { id })
      .getOne() as unknown as Promise<EventWithApplications>;
  }

  findByIdDetailed(
    id: number,
    options?: EventFindOptions
  ): Promise<EventWithApplications> {
    return this.createQueryBuilder({
      ...options,
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
    })
      .where({ id })
      .getOne() as unknown as Promise<EventWithApplications>;
  }

  save(event: Partial<Event>) {
    return this.eventsRepository.save(new Event(event));
  }

  findByFilter(
    filter?: EventFilter,
    options?: EventFindOptions
  ): Promise<EventWithApplications[]> {
    const query = this.createQueryBuilder(options);

    if (filter.since)
      query.andWhere("event.since > :since", { since: filter.since });
    if (filter.to) query.andWhere("event.since < :to", { to: filter.to });

    return query.getMany() as unknown as Promise<EventWithApplications[]>;
  }
}
