import {
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
	getSchemaPath,
} from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

import { CookieGuard } from "../auth/providers/guards";
import { Event, EventsService } from "./index";
import { EventLink, EventSpot } from "./entities";
import { PhotoService } from "../photo";
import type { User } from "../users";
import { ParseDatePipe } from "utilities/nest/pipes";

import { CurrentUser } from "../../decorators";
import { EventSimpleWithApplicationsMapper } from "../../mappers";
import { CreateEvent, UpdateEvent, UpdatePhoto } from "../../models/requests";
import { EventDetail, EventSimple } from "../../models/responses";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { PaginationDto, PaginationResponseDto } from "../../models/responses/pagination-response.dto";

@ApiTags("Events")
@Controller("events")
export class EventsController {
	constructor(
		private readonly eventsService: EventsService,
		private readonly photoService: PhotoService,
		private readonly eventSimpleWithApplicationsMapper: EventSimpleWithApplicationsMapper,
	) {
	}

	/**
	 * To filter by `since` use:
	 *
	 * `sinceSince`: Events with `since` more than entered value
	 *
	 * `toSince`: Events with `since` less than entered value
	 *
	 *
	 * Examples:
	 * - To filter only future events use `sinceSince` `(new Date().getTime())`
	 * - To filter only past events use `toSince` `(new Date().getTime())`
	 * - To filter only events between two dates use `sinceSince`: `dateA`, `toSince`: `dateB`
	 *
	 */
	@ApiExtraModels(Event, PaginationResponseDto<Event>)
	@ApiOkResponse({
		description: "All Events",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: { $ref: getSchemaPath(Event) },
						},
						pagination: { $ref: getSchemaPath(PaginationDto) },
					},
				},
			},
		},
	})
	@ApiQuery({ name: "sinceSince", required: false, type: Number })
	@ApiQuery({ name: "toSince", required: false, type: Number })
	@Get()
	async getEvents(
		@Query("sinceSince", ParseDatePipe) since?: Date,
		@Query("toSince", ParseDatePipe) to?: Date,
		@Pagination() pagination?: PaginationOptions,
	) {
		const events = await this.eventsService.findByFilter(
			{ since, to },
			{
				visible: true,
				relations: { applications: true },
			},
			pagination,
		);

		return events;
	}

	/**
	 * Find event by ID or slug
	 */
	@ApiOkResponse({ type: EventDetail, description: "Found event" })
	@ApiNotFoundResponse({ description: "Event not found" })
	@Get(":id")
	async getEvent(@Param("id", ParseIntPipe) id: number) {
		const event = await this.eventsService.findByIdDetailed(id, {
			relations: {
				applications: true,
			},
		});
		if (!event) throw new NotFoundException("Event not found");

		return this.eventSimpleWithApplicationsMapper.map(event);
	}

	/**
	 * Create new event
	 *
	 * Organization permissions required: `create.event`
	 */
	@ApiCreatedResponse({ type: EventSimple, description: "Created event" })
	@ApiForbiddenResponse({
		description: "User is not member of event organization or does not have required permissions",
	})
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post()
	async createEvent(@CurrentUser() user: User, @Body() body: CreateEvent) {
		// TODO: Check user role for modifications

		let event = new Event();
		event.title = body.title;
		event.longDescription = body.longDescription;
		event.shortDescription = body.shortDescription;
		event.since = new Date(body.since);
		event.until = new Date(body.until);
		event.createdByUser = user;
		event.visible = body.visible;
		event.registrationDeadline = new Date(body.registrationDeadline);
		event.registrationForm = body.registrationForm;
		event.capacity = body.capacity;
		event.codeOfConductLink = body.codeOfConductLink;
		event.photoPolicyLink = body.photoPolicyLink;
		event.termsAndConditionsLink = body.termsAndConditionsLink;
		event.applications = [];

		event = await this.eventsService.save(event);
		return this.eventSimpleWithApplicationsMapper.map(event);
	}

	/**
	 * Duplicate event by ID
	 */
	@ApiCreatedResponse({ type: EventDetail, description: "Duplicated event" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post(":id")
	async duplicateEvent(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
		const event = await this.eventsService.findByIdDetailed(id);

		let newEvent = new Event({
			title: event.title,
			since: event.since,
			until: event.until,
			capacity: event.capacity,
			longDescription: event.longDescription,
			shortDescription: event.shortDescription,
			codeOfConductLink: event.codeOfConductLink,
			photoPolicyLink: event.photoPolicyLink,
			termsAndConditionsLink: event.termsAndConditionsLink,
			createdByUser: user,
			visible: false,
			registrationForm: event.registrationForm,
			registrationDeadline: event.registrationDeadline,
			generateInvoices: event.generateInvoices,
			spotTypes: event.spotTypes.map((e) => new EventSpot({ name: e.name, price: e.price })),
			links: event.links.map((e) => new EventLink({ link: e.link, name: e.name })),
		});

		newEvent = await this.eventsService.save(newEvent);
		return this.eventSimpleWithApplicationsMapper.map(newEvent);
	}

	@ApiOkResponse({ type: EventDetail, description: "Updated event" })
	@ApiForbiddenResponse({
		description: "User is not member of event organization or does not have required permissions",
	})
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Patch(":eventId")
	async updateEvent(
		@Param("eventId", ParseIntPipe) eventId: number,
		@CurrentUser() user: User,
		@Body() body: UpdateEvent,
	) {
		// TODO: Check user role for modifications
		let event = await this.eventsService.findByIdDetailed(eventId, {
			visible: true,
		});
		if (!event) throw new NotFoundException("Event not found");
		Object.assign(event, body);

		event = await this.eventsService.save(event);
		return this.eventSimpleWithApplicationsMapper.map(event);
	}

	/**
	 * Update event photo
	 * Organization permissions required: `create.event`
	 */
	@ApiForbiddenResponse({
		description: "User is not member of event organization or does not have required permissions",
	})
	@ApiNotFoundResponse({ description: "Event not found" })
	@ApiConsumes("multipart/form-data")
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@FormDataRequest()
	@Patch(":eventId/photo")
	async updateEventPhoto(
		@Param("eventId", ParseIntPipe) eventId: number,
		@CurrentUser() user: User,
		@Body() body: UpdatePhoto,
	) {
		// TODO: Check user role for modifications

		const event = await this.eventsService.findByIdDetailed(eventId, {
			relations: { applications: true },
		});
		if (!event) throw new NotFoundException("Event not found");

		const photo = await this.photoService.save(body.file.buffer, "event_photo");
		if (!photo) new InternalServerErrorException("Could not save photo");

		event.photo = photo;
		await this.eventsService.save(event);
		return this.eventSimpleWithApplicationsMapper.map(event);
	}

	@ApiOkResponse({ description: "Event deleted" })
	@ApiNotFoundResponse({ description: "Event not found" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Delete(":eventId")
	async deleteEvent(@Param("eventId", ParseIntPipe) eventId: number) {
		const event = await this.eventsService.findById(eventId);
		if (!event) throw new NotFoundException("Event not found");

		await this.eventsService.delete(event);
	}
}
