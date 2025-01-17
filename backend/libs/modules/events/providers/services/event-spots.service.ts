import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions } from "libs/types";
import { Event, EventApplication, EventSpot } from "modules/events/entities";
import { Repository } from "typeorm";

@Injectable()
export class EventSpotsService {
	constructor(
		@InjectRepository(EventSpot)
		private readonly eventSpotRepository: Repository<EventSpot>,
	) {}

	findById(id: EventSpot["id"]) {
		return this.eventSpotRepository.findOne({
			where: { id },
			relations: {
				event: {
					createdByUser: {
						photo: true,
					},
				},
			},
		});
	}

	/**
	 * Find event spots by event ID
	 * @param id Event ID
	 * @returns Array of event spots
	 */
	findByEventId(id: Event["id"], options?: FindManyOptions) {
		return this.eventSpotRepository.find({
			where: {
				event: {
					id,
				},
			},
			skip: options?.pagination?.skip,
			take: options?.pagination?.take,
		});
	}

	/**
	 * Save event spot
	 * @param data Event spot data
	 * @returns Saved event spot data
	 */
	save(data: EventSpot) {
		return this.eventSpotRepository.save(data);
	}

	/**
	 * Delete event spot and replace application spots if necessary
	 * @param eventSpot Spot
	 * @param replaceApplicationsWith Replace applications with this spot to another spot
	 */
	async delete(eventSpot: EventSpot, replaceApplicationsWith?: EventSpot) {
		if (!replaceApplicationsWith) {
			await this.eventSpotRepository.remove(eventSpot);
			return;
		}

		await this.eventSpotRepository.manager.transaction(async (entityManager) => {
			await entityManager.update(
				EventApplication,
				{ spotType: { id: eventSpot.id } },
				{ spotType: replaceApplicationsWith },
			);
			await entityManager.remove(eventSpot);
		});
	}
}
