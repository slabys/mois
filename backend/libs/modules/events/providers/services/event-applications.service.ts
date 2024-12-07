import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions } from "libs/types";
import { EventApplication } from "modules/events/entities";
import { Repository } from "typeorm";

@Injectable()
export class EventApplicationsService {
  constructor(
    @InjectRepository(EventApplication)
    private readonly eventApplicationRepository: Repository<EventApplication>
  ) {}

  /**
   * Find applications by user ID
   * @param id User ID
   * @returns Array of user applications
   */
  findByUserId(id: string, options?: FindManyOptions) {
    return this.eventApplicationRepository.find({
      where: {
        user: { id },
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
   * Save application data
   * @param data
   * @returns
   */
  save(data: Partial<EventApplication>) {
    return this.eventApplicationRepository.save(data);
  }
}
