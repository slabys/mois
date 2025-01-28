import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { IStrategyOptions, Strategy } from "passport-local";

import { User } from "modules/users";
import { AuthService } from "../services";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super(<IStrategyOptions>{
			passwordField: "password",
			usernameField: "email",
		});
	}

	async validate(email: string, password: string): Promise<User> {
		const user = await this.authService.validateUser(email, password);
		if (!user) throw new UnauthorizedException("Invalid password or username or email does not exist");
		// Do not expose password hash by mistake

		user.password = undefined;
		return user;
	}
}
