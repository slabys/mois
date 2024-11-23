import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
  findByUserId(id: string) {
    return this.eventApplicationRepository.find({
      where: {
        user: { id },
      },
      relations: {
        event: {
          createdBy: {
            organization: true,
          },
        },
        spotType: true
      },
    });
  }
}
