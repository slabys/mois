import { Body, Controller, Delete, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { CookieGuard, LocalGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";
import { LoginUser } from "../models/requests";
import { AccessToken } from "../models/responses";

import { AuthService } from "modules/auth";
import { User } from "modules/users";
import { Response } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  /**
   * Try to login user with given email and password
   */
  @ApiUnauthorizedResponse({
    description: "Invalid password or user does not exist",
  })
  @ApiCreatedResponse({ type: AccessToken, description: "User access token" })
  @UseGuards(LocalGuard)
  @Post("login")
  async loginUserWithEmail(
    @Body() data: LoginUser,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.createToken(user);

    response
      .cookie("AuthCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 1_000,
      })
      .status(HttpStatus.OK)
      .send(<AccessToken>{ accessToken: token });
  }

  /**
   * Logout user
   * @param response
   */
  @ApiOkResponse({ description: "User is no longer logged-in" })
  @ApiBearerAuth()
  @UseGuards(CookieGuard)
  @Delete("logout")
  async logoutUser(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("AuthCookie").status(HttpStatus.OK);
  }
}
