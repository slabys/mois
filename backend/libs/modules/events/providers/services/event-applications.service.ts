import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions } from "libs/types";
import { EventApplication } from "modules/events/entities";
import { EventFilter } from "modules/events/models";
import { filterSince } from "modules/events/utilities";
import { FindOneOptions, Repository } from "typeorm";

interface FindEventOptions extends FindManyOptions {
  filter: EventFilter;
}

@Injectable()
export class EventApplicationsService {
  constructor(
    @InjectRepository(EventApplication)
    private readonly eventApplicationRepository: Repository<EventApplication>
  ) {}

  /**
   * Find event application by ID
   * @param id Event application ID
   * @returns
   */
  findById(id: number, options?: FindOneOptions<EventApplication>) {
    return this.eventApplicationRepository.findOne({
      ...(options ?? {}),
      where: { id },
      relations: {
        ...(options?.relations ?? {}),
        user: true,
        spotType: true,
      },
    });
  }
  /**
   * Find event applications by event ID
   * @param id
   * @returns
   */
  findByEventId(id: number) {
    return this.eventApplicationRepository.find({
      where: { event: { id } },
      relations: {
        user: true,
        spotType: true,
      },
    });
  }

  /**
   * Find applications by user ID
   * @param id User ID
   * @returns Array of user applications
   */
  findByUserId(id: string, options?: FindEventOptions) {
    return this.eventApplicationRepository.find({
      where: {
        user: { id },
        // Apply event filters
        ...(options?.filter ? { event: filterSince(options.filter) } : {}),
      },
      relations: {
        event: {
          createdByUser: true,
        },
        spotType: true,
      },
      take: options?.pagination?.take,
      skip: options?.pagination?.skip,
    });
  }

  /**
   * @param id User ID
   * @param options
   * @returns
   */
  findByUserIdDetailed(id: string, options?: FindEventOptions) {
    return this.eventApplicationRepository.find({
      where: {
        user: { id },
        // Apply event filters
        ...(options?.filter ? { event: filterSince(options.filter) } : {}),
      },
      select: {
        id: true,
        additionalData: true as never,
        createdAt: true,
        idNumber: true,
      },
      relations: {
        customOrganization: true,
        organization: true,
        user: true,
        spotType: true,
        event: true,
      },
      take: options?.pagination?.take,
      skip: options?.pagination?.skip,
    });
  }

  /**
   * Find applications by event ID detailed (with relations)
   * @param id Event ID
   * @returns
   */
  findByEventIdDetailed(id: number) {
    return this.eventApplicationRepository.find({
      where: { event: { id } },
      select: {
        id: true,
        additionalData: true as never,
        createdAt: true,
        idNumber: true,
      },
      relations: {
        customOrganization: true,
        organization: true,
        user: true,
        spotType: true,
      },
    });
  }

  /**
   * Save application data
   * @param data
   * @returns
   */
  save(data: Partial<EventApplication>) {
    return this.eventApplicationRepository.save(data);
  }

  /**
   * Delete event application
   * @param application Application
   */
  async delete(application: EventApplication) {
    await this.eventApplicationRepository.remove(application);
  }
}
