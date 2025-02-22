import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Organization, OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { CurrentUser } from "../decorators";
import { User } from "modules/users";
import { CookieGuard } from "modules/auth/providers/guards";
import { CreateOrganization, UpdateOrganization } from "../models/requests";
import { Address } from "modules/addresses";
import { Permission } from "modules/roles";

@ApiTags("Organizations")
@Controller("organizations")
export class OrganizationsController {
	constructor(
		private readonly organizationService: OrganizationService,
	) {
	}

	@Get()
	allOrganizations(@Pagination() pagination: PaginationOptions) {
		return this.organizationService.findAll({ pagination });
	}


	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Get(":id")
	async getOrganisationById(@Param("id", ParseUUIDPipe) id: string) {
		const organization = await this.organizationService.findById(id);
		if (!organization) throw new NotFoundException("Organization not found");

		return organization;
	}

	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post()
	createOrganization(@CurrentUser() user: User, @Body() body: CreateOrganization) {
		const organization = new Organization();
		const { address } = body;

		organization.name = body.name;
		organization.address = new Address({
			city: address.city,
			houseNumber: address.houseNumber,
			country: address.country,
			street: address.street,
			zip: address.zip,
		});

		return this.organizationService.save(organization);
	}

	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post(":id")
	async updateOrganization(@Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateOrganization) {
		const organization = await this.organizationService.findById(id);
		if (!organization) throw new NotFoundException("Organization not found");

		organization.name = body.name ?? organization.name;

		if (body.address) {
			organization.address.update(body.address);
		}

		return this.organizationService.save(organization);
	}

	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post(":organisationId/:userId")
	async transferManager(@CurrentUser() user: User, @Param("organisationId", ParseUUIDPipe) organisationId: string, @Param("userId", ParseUUIDPipe) userId: string) {
		const organization = await this.organizationService.findById(organisationId);

		if (organization?.manager?.id === user?.id || user.role.hasPermission(Permission.OrganisationUpdate)) {
			const organisationMember = await this.organizationService.findMemberByUserId(organisationId, userId, { relations: { user: true } });

			organization.update({ manager: organisationMember.user });
			return await this.organizationService.save(organization);
		}

		throw new UnauthorizedException("You don't have permission to perform this action");

	}
}
