import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Organization, OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { CurrentUser } from "../decorators";
import { User } from "modules/users";
import { CookieGuard } from "modules/auth/providers/guards";
import { CreateOrganization, UpdateOrganization } from "../models/requests";
import { Address } from "modules/addresses";

@ApiTags("Organizations")
@Controller("organizations")
export class OrganizationsController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Get()
	allOrganizations(@Pagination() pagination: PaginationOptions) {
		return this.organizationService.findAll({ pagination });
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
}
