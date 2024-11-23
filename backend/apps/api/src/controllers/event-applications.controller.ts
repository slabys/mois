import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Event applications")
@Controller()
export class EventApplicationsController {



  @Get()
  getUserApplications() {}
}