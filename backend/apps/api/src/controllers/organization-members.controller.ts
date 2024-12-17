import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

import { CookieGuard } from "modules/auth/providers/guards";
import {
  AddOrganizationMembers,
  DeleteOrganizationMembers,
} from "../models/requests";
import { OrganizationMemberWithoutOrganization } from "../models/responses";
import { UsersService } from "modules/users";

@ApiTags("Organization members")
@Controller("organization/:id")
export class OrganizationMembersController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly usersService: UsersService
  ) {}

  @ApiOkResponse({
    type: [OrganizationMemberWithoutOrganization],
    description: "All members within organization",
  })
  @Get("members")
  organizationMembers(
    @Param("id") organizationId: string,
    @Pagination() pagination: PaginationOptions
  ) {
    return this.organizationService.findMembersOf(organizationId, {
      pagination,
    });
  }

  /**
   * Add members to organization
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Post("members")
  async addOrganizationMembers(
    @Param("id") organizationId: string,
    @Body() body: AddOrganizationMembers
  ) {
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
  @Delete("members")
  async deleteOrganizationMembers(
    @Param("id") organizationId: string,
    @Body() body: DeleteOrganizationMembers
  ) {
    const organization = await this.organizationService.findById(
      organizationId
    );
    if (!organization) throw new NotFoundException("Organization not found");

    await this.organizationService.deleteMembers(organization, body.memberIds);
  }
}
