import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

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
  organizationMembers(
    @Param("id") organizationId: string,
    @Pagination() pagination: PaginationOptions
  ) {
    return this.organizationService.findMembersOf(organizationId, {
      pagination,
    });
  }
}
