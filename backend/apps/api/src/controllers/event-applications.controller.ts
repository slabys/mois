import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CookieGuard } from "modules/auth/providers/guards";
import { EventApplicationsService } from "modules/events";
import { CurrentUser } from "../decorators";
import { User } from "modules/users";

@ApiTags("Event applications")
@Controller("events/applications")
export class EventApplicationsController {
  constructor(
    private readonly eventApplicationsService: EventApplicationsService
  ) {}

  /**
   * Get all user applications
   */
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Get()
  getUserApplications(@CurrentUser() user: User) {
    return this.eventApplicationsService.findByUserId(user.id);
  }
}
