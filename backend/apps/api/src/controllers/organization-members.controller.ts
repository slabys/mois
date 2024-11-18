import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "modules/auth/providers/guards";
import { OrganizationService } from "modules/organization";
import { User } from "modules/users";
import { CurrentUser } from "../decorators";
import { OrganizationMemberWithoutOrganization } from "../models/responses";

@ApiTags("Organization members")
@Controller("organization/:id")
export class OrganizationMembersController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOkResponse({
    type: [OrganizationMemberWithoutOrganization],
    description: "All members within organization",
  })
  @Get("members")
  organizationMembers(@Param("id") organizationId: string) {
    return this.organizationService.findMembersOf(organizationId);
  }

  @ApiOkResponse({
    type: OrganizationMemberWithoutOrganization,
    description: "Current user membership within organization",
  })
  @ApiNotFoundResponse({ description: "User is not member of organization" })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get("membership")
  async userOrganizationMembership(
    @Param("id") organizationId: string,
    @CurrentUser() user: User
  ) {
    const member = await this.organizationService.findMemberByUserId(
      organizationId,
      user.id
    );
    if (!member) throw new NotFoundException("Not member of organization");
    return member;
  }
}
