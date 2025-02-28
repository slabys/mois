import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	NotFoundException,
	NotImplementedException,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiConflictResponse,
	ApiExtraModels,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
	getSchemaPath,
} from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";

import { Address } from "modules/addresses";
import { CookieGuard } from "modules/auth/providers/guards";
import { EventApplicationsService, EventSpotsService, EventsService } from "modules/events";
import { EventApplication, EventCustomOrganization } from "modules/events/entities";
import { FileStorageService } from "modules/file-storage";
import { InvoiceService } from "modules/invoice";
import { InvoiceItem } from "modules/invoice/entities";
import { InvoiceCurrency } from "modules/invoice/enums";
import { OrganizationService } from "modules/organization";
import { PaymentSubject } from "modules/payments";
import { User, UsersService } from "modules/users";
import { ajv } from "utilities/ajv";
import { ParseDatePipe } from "utilities/nest/pipes";

import { CurrentUser } from "../decorators";
import { CreateEventApplication, UpdateEventApplication } from "../models/requests";
import { EventApplicationInvoice, EventApplicationSimpleWithApplications } from "../models/responses";
import { EventApplicationSimpleWithApplicationsMapper } from "../mappers";
import {
	EventApplicationDetailedWithApplications,
} from "../models/responses/event-application-detailed-with-applications.dto";
import { PaginationDto, PaginationResponseDto } from "../models/responses/pagination-response.dto";

@ApiTags("Event applications")
@Controller("events")
export class EventApplicationsController {
	constructor(
		private readonly eventApplicationsService: EventApplicationsService,
		private readonly eventService: EventsService,
		private readonly usersService: UsersService,
		private readonly organizationService: OrganizationService,
		private readonly eventSpotsService: EventSpotsService,
		private readonly invoiceService: InvoiceService,
		private readonly fileStorageService: FileStorageService,
		private readonly eventApplicationSimpleWithApplicationsMapper: EventApplicationSimpleWithApplicationsMapper,
	) {
	}

	/**
	 * Get all signed-in user applications
	 *
	 * For filtering look at {@link EventsController}
	 */
	@ApiBearerAuth()
	@ApiQuery({ name: "sinceSince", required: false, type: Number })
	@ApiQuery({ name: "toSince", required: false, type: Number })
	@ApiExtraModels(EventApplication, PaginationResponseDto<EventApplication>)
	@ApiOkResponse({
		description: "All Events",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: { $ref: getSchemaPath(EventApplication) },
						},
						pagination: { $ref: getSchemaPath(PaginationDto) },
					},
				},
			},
		},
	})
	@UseGuards(CookieGuard)
	@Get("applications")
	async getUserApplications(
		@CurrentUser() user: User,
		@Query("sinceSince", ParseDatePipe) since?: Date,
		@Query("toSince", ParseDatePipe) to?: Date,
	) {
		return await this.eventApplicationsService.findByUserIdDetailed(user.id, {
			filter: { to, since },
			relations: { event: { applications: true } },
		});
	}

	/**
	 * Gett all event user applications
	 * @param eventId
	 * @returns
	 */
	@ApiBearerAuth()
	@ApiOkResponse({ type: [EventApplicationDetailedWithApplications] })
	@UseGuards(CookieGuard)
	@Get(":eventId/applications")
	async getEventApplications(@Param("eventId", ParseIntPipe) eventId: number) {
		const application = await this.eventApplicationsService.findByEventIdDetailed(eventId, {
			relations: { event: { applications: true } },
		});
		return this.eventApplicationSimpleWithApplicationsMapper.map(application);
	}

	/**
	 * Create event application
	 */
	@ApiConflictResponse({
		description: "Event application for user already exist",
	})
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post(":eventId/applications")
	async createUserApplication(
		@CurrentUser() user: User,
		@Param("eventId", ParseIntPipe) eventId: number,
		@Body() body: CreateEventApplication,
	): Promise<EventApplicationSimpleWithApplications> {
		const exist = await this.eventApplicationsService.exist(eventId, user.id);
		if (exist) throw new ConflictException("Event application already exist");

		const currentUser = await this.usersService.findById(user.id, {
			relations: { personalAddress: true },
		});

		if (!currentUser.personalAddress) throw new ForbiddenException("User must have valid personal address");

		let application = new EventApplication({
			user,
			personalAddress: currentUser.personalAddress.copy(),
			invoiceMethod: body.invoiceMethod,
			invoicedTo: body.invoicedTo,
			additionalInformation: body.additionalInformation ?? "",
			invoiceAddress: new Address(body.invoiceAddress),
			validUntil: body.validUntil,
			idNumber: body.idNumber,
		});

		if (body.organization.type === "organization") {
			const member = await this.organizationService.findMemberByUserId(body.organization.id, user.id, {
				relations: { organization: true },
			});

			if (!member) throw new BadRequestException("Invalid organization given");
			application.organization = member.organization;
		} else {
			application.customOrganization = new EventCustomOrganization({
				country: body.organization.country,
				name: body.organization.name,
			});
		}

		const event = await this.eventService.findById(eventId, {
			relations: { spotTypes: true, applications: true },
			select: { registrationForm: {}, id: true },
		});
		if (!event) throw new NotFoundException("Event not found");

		application.event = event;

		if (body.spotTypeId) {
			const spotType = event.spotTypes.find((e) => e.id === body.spotTypeId);
			if (!spotType) throw new NotFoundException("Spot type not found");

			application.spotType = spotType;
		}

		if (event.registrationForm) {
			const isFormValid = await ajv.validate(event.registrationForm, body.additionalFormData);

			if (!isFormValid) throw new BadRequestException("Registration form data are not valid");

			application.additionalData = body.additionalFormData;
		}

		// Hard-coded invoice
		const invoice = await this.invoiceService.create({
			constantSymbol: 123,
			currency: application?.invoice?.currency ?? InvoiceCurrency.CZK,
			iban: "CZ6508000000192000145399",
			items: application.spotType
				? [
					new InvoiceItem({
						amount: 1,
						name: `Spot: ${application.spotType.name}`,
						price: application.spotType.price,
					}),
				]
				: [],
			swift: "SWIFT",
			subscriber: new PaymentSubject({
				address: application.invoiceAddress,
				name: "Subscriber",
			}),
			supplier: new PaymentSubject({
				// TODO: Hlavní sekce
				address: new Address({
					city: "CITY",
					country: "Czech Republic",
					houseNumber: "50/7",
					street: "STREET",
					zip: "111 10",
				}),
				name: "SUPPLIER",
			}),
			variableSymbol: 123,
		});
		application.invoice = invoice;
		application = await this.eventApplicationsService.save(application);
		return this.eventApplicationSimpleWithApplicationsMapper.map(application);
	}

	/**
	 * Update event application
	 *
	 * @param applicationId Event Application ID
	 * @param body
	 * @returns
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Patch("application/:id")
	async updateEventApplication(
		@Param("id", ParseIntPipe) applicationId: number,
		@Body() body: UpdateEventApplication,
	): Promise<EventApplicationSimpleWithApplications> {
		let application = await this.eventApplicationsService.findById(applicationId, {
			relations: {
				personalAddress: true,
				event: {
					applications: true,
				},
			},
		});
		if (!application) throw new NotFoundException("Event application not found");

		if (body.spotTypeId) {
			const eventSpot = await this.eventSpotsService.findById(body.spotTypeId);
			if (!eventSpot) throw new BadRequestException("Invalid event spot");

			application.spotType = eventSpot;
		}
		if (body.spotTypeId === null) application.spotType = null;

		if (body.invoiceAddress) application.personalAddress.update(body.invoiceAddress);

		application.validUntil = body.validUntil ?? application.validUntil;
		application.idNumber = body.idNumber ?? application.idNumber;

		if (body.additionalFormData) {
			const event = await this.eventService.findById(application.event.id, {
				relations: { spotTypes: true },
				select: { registrationForm: {}, id: true },
			});
			if (!event) throw new NotFoundException("Event not found");

			if (event.registrationForm) {
				const isFormValid = await ajv.validate(event.registrationForm, body.additionalFormData);

				if (!isFormValid) throw new BadRequestException("Registration form data are not valid");

				application.additionalData = body.additionalFormData;
			}
		}

		application = await this.eventApplicationsService.save(application);
		return this.eventApplicationSimpleWithApplicationsMapper.map(application);
	}

	/**
	 * Delete event application by ID
	 */
	@ApiOkResponse({ description: "Event application deleted" })
	@ApiNotFoundResponse({ description: "Event application not found" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Delete("application/:id")
	async deleteEventApplication(@Param("id", ParseIntPipe) applicationId: number) {
		const application = await this.eventApplicationsService.findById(applicationId);
		if (!application) throw new NotFoundException("Event application not found");

		await this.eventApplicationsService.delete(application);
	}

	@ApiOkResponse({ description: "Event application deleted" })
	@ApiNotFoundResponse({ description: "Event application not found" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Get("application/:id/invoice")
	async getEventApplicationInvoice(@Param("id", ParseIntPipe) applicationId: number): Promise<EventApplicationInvoice> {
		const application = await this.eventApplicationsService.findById(applicationId, {
			relations: {
				invoice: {
					subscriber: { address: true },
					supplier: { address: true },
				},
			},
		});

		if (!application?.invoice) throw new NotFoundException("Invoice not found");

		const result = await this.invoiceService.generatePdfFromInvoice(application.invoice);
		const value = await firstValueFrom(result);

		if (value.success) {
			return {
				invoice: application.invoice,
				url: await this.fileStorageService.getPublicUrl(value.outputPath),
			};
		}
		throw new InternalServerErrorException("Could not generate invoice");
	}

	/**
	 * Get event application for user for event
	 */
	@ApiOkResponse({ type: EventApplicationSimpleWithApplications })
	@ApiNotFoundResponse({ description: "Event application not found" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Get(":eventId/applications/user/:userId")
	async getUserApplicationForEvent(
		@Param("eventId", ParseIntPipe) eventId: number,
		@Param("userId", ParseUUIDPipe) userId: string,
		@CurrentUser() user: User,
	) {
		if (user.id !== userId) throw new NotImplementedException("User cannot get application for another user yet");
		const application = await this.eventApplicationsService.findByEventAndUserId(eventId, userId);

		if (!application) throw new NotFoundException("Event application not found");

		return this.eventApplicationSimpleWithApplicationsMapper.map(application);
	}
}
