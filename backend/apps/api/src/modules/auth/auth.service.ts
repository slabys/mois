import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User, UsersService } from "@api/modules/users";
import { verifyPassword } from "@api/modules/auth/utilities/crypto";
import { JwtContent } from "./types";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {
	}

	/**
	 * Validate user email and password in database
	 * @param emailOrUsername User email
	 * @param password User password
	 * @returns {UserFindByEmailResult | null} Null if password does not match
	 */
	async validateUser(emailOrUsername: string, password: string): Promise<User | null> {
		const user = await this.usersService.findByUsernameOrEmailWithPassword(emailOrUsername);
		if (!user) return null;

		const result = await verifyPassword(password, user.password);
		return result ? user : null;
	}

	/**
	 * Create user jwt
	 * @param user User data
	 * @returns Token
	 */
	createToken(user: User) {
		return this.jwtService.signAsync(<JwtContent>{
			sub: user.id,
		});
	}
}
