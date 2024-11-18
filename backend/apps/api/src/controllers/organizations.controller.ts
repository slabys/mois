import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrganizationService } from "modules/organization";

@ApiTags("Organizations")
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  allOrganizations() {
    return this.organizationService.findAll();
  }
}
