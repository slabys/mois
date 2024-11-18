import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { University, UniversityService } from "modules/university";

@ApiTags("Universities")
@Controller("universities")
export class UniversitiesController {
  constructor(private readonly universityService: UniversityService) {}

  @ApiOkResponse({
    type: [University],
    description: "All available universities",
  })
  @Get()
  async supportedUniversities() {
    return this.universityService.findAll();
  }
}
