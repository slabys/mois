import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

import { OrganizationService } from "./index";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

import { CookieGuard } from "../auth/providers/guards";
import { AddOrganizationMembers } from "../../models/requests";
import { User, UsersService } from "../users";
import { PaginationDto, PaginationResponseDto } from "../../models/responses/pagination-response.dto";
import { OrganizationMember } from "./entities";
import { Permission } from "@api/modules/roles";
import { CurrentUser } from "@api/decorators";

@ApiTags("Organization members")
@Controller("organization/:id")
export class OrganizationMembersController {
	constructor(
		private readonly organizationService: OrganizationService,
		private readonly usersService: UsersService,
	) {}

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
	async addOrganizationMembers(
		@CurrentUser() currentUser: User,
		@Param("id") organizationId: string,
		@Body() body: AddOrganizationMembers,
	) {
		if (!currentUser.role.hasOneOfPermissions([Permission.OrganisationAddUser])) {
			throw new ForbiddenException("User does not have required permissions");
		}
		const organization = await this.organizationService.findById(organizationId);
		if (!organization) throw new NotFoundException("Organization not found");

		const memberIds = organization.members.map((member) => member.user.id);
		const unassignedMemberIds = body.userIds.filter((userId) => !memberIds.includes(userId));
		const newMembers = await this.usersService.findManyById(unassignedMemberIds);

		return this.organizationService.addMembers(organization, newMembers);
	}

	/**
	 * Delete members from organization (`member.id` not `user.id`)
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Delete("members/:memberId")
	async deleteOrganizationMembers(
		@Param("id") organisationId: string,
		@Param("memberId") organisationMemberId: string,
	) {
		const organization = await this.organizationService.findById(organisationId);
		if (!organization) throw new NotFoundException("Organization not found");

		const organisationMember = organization.members.find((member) => member.id.toString() === organisationMemberId);
		if (organization.manager !== null && organization.manager.id === organisationMember.user.id) {
			await this.organizationService.deleteOrganisationManager(organization.id);
		}

		return await this.organizationService.deleteMembers(organisationMemberId);
	}
}
