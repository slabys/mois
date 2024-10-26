import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { LocalGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";
import { LoginUser } from "../models/requests";
import { AccessToken } from "../models/responses";

import { AuthService } from "modules/auth";
import { User } from "modules/users";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Try to login user with given email and password
   */
  @ApiUnauthorizedResponse({
    description: "Invalid password or user does not exist",
  })
  @ApiCreatedResponse({ type: AccessToken, description: "User access token" })
  @UseGuards(LocalGuard)
  @Post("login")
  async loginUserWithEmail(@Body() data: LoginUser, @CurrentUser() user: User) {
    const token = await this.authService.createToken(user);

    return <AccessToken>{
      accessToken: token,
    };
  }
}
