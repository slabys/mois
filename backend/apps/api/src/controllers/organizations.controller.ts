import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { OrganizationService } from "modules/organization";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";

@ApiTags("Organizations")
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  allOrganizations(@Pagination() pagination: PaginationOptions) {
    return this.organizationService.findAll({ pagination });
  }

  
}
