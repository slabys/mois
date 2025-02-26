import { Body, Controller, Delete, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";

import { CookieGuard, LocalGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";
import { LoginUser } from "../models/requests";
import { AccessToken } from "../models/responses";

import { AuthService } from "modules/auth";
import type { User } from "modules/users";
import { isProduction } from "utilities/env";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	/**
	 * Try to login user with given email and password
	 */
	@ApiCreatedResponse({ type: AccessToken, description: "User access token" })
	@UseGuards(LocalGuard)
	@Post("login")
	async loginUserWithEmailOrUsername(
		@Body() data: LoginUser,
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response,
	) {
		const token = await this.authService.createToken(user);
		
		response
			.cookie("AuthCookie", token, {
				domain: isProduction ? process.env.WEB_DOMAIN : "localhost",
				httpOnly: true,
				secure: true,
				sameSite: "none",
				partitioned: isProduction,
				maxAge: 7 * 24 * 60 * 60 * 1_000,
				path: "/",
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
		response
			.clearCookie("AuthCookie", {
				domain: isProduction ? process.env.WEB_DOMAIN : "localhost",
				httpOnly: true,
				secure: true,
				sameSite: "none",
				partitioned: isProduction,
				maxAge: 0,
				path: "/",
			})
			.status(HttpStatus.OK);
	}
}
