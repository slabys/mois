import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { JwtStrategy, LocalStrategy } from "./providers/strategies";
import { AuthService } from "./providers/services";
import { JwtGuard, LocalGuard } from "./providers/guards";

import { UsersModule } from "modules/users";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: configService.getOrThrow("JWT_SECRET"),
        signOptions: {
          issuer: "MOIS",
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtGuard, LocalGuard],
  exports: [AuthService, JwtGuard],
})
export class AuthModule {}
