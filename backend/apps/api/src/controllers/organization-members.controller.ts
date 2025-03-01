import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

import { OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

import { CookieGuard } from "modules/auth/providers/guards";
import { AddOrganizationMembers } from "../models/requests";
import { UsersService } from "modules/users";
import { PaginationDto, PaginationResponseDto } from "../models/responses/pagination-response.dto";
import { OrganizationMember } from "modules/organization/entities";

@ApiTags("Organization members")
@Controller("organization/:id")
export class OrganizationMembersController {
	constructor(
		private readonly organizationService: OrganizationService,
		private readonly usersService: UsersService,
	) {
	}

	@ApiExtraModels(OrganizationMember, PaginationResponseDto<OrganizationMember>)
	@ApiOkResponse({
		description: "All members within organization",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: { $ref: getSchemaPath(OrganizationMember) },
						},
						pagination: { $ref: getSchemaPath(PaginationDto) },
					},
				},
			},
		},
	})
	@Get("members")
	organizationMembers(@Param("id") organizationId: string, @Pagination() pagination?: PaginationOptions) {
		return this.organizationService.findMembersOf(organizationId, pagination);
	}

	/**
	 * Add members to organization
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Post("members")
	async addOrganizationMembers(@Param("id") organizationId: string, @Body() body: AddOrganizationMembers) {
		const [organization, users] = await Promise.all([
			this.organizationService.findById(organizationId),
			this.usersService.findManyById(body.userIds),
		]);

		if (!organization) throw new NotFoundException("Organization not found");

		return this.organizationService.addMembers(organization, users);
	}

	/**
	 * Delete members from organization (`member.id` not `user.id`)
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Delete("members/:memberId")
	async deleteOrganizationMembers(@Param("id") organizationId: string, @Param("memberId") organisationMemberId: string) {
		const organization = await this.organizationService.findById(organizationId);
		if (!organization) throw new NotFoundException("Organization not found");

		const organisationMember = organization.members.find((member) => member.id.toString() === organisationMemberId);
		if (organization.manager.id === organisationMember.user.id) {
			await this.organizationService.deleteOrganisationManager(organization.id);
		}

		return await this.organizationService.deleteMembers(organisationMemberId);
	}
}
