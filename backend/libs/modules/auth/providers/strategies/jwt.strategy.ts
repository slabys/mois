import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { User, UsersService } from "modules/users";
import { JwtContent } from "modules/auth/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow("JWT_SECRET"),
      ignoreExpiration: false,
      issuer: "MOIS",
    });
  }

  async validate(tokenData: JwtContent): Promise<User> {
    const user = await this.usersService.findById(tokenData.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
