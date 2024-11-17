import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import {
  AuthController,
  UniversitiesController,
  UsersController,
} from "./controllers";

import { AuthModule } from "modules/auth";
import { UniversityModule } from "modules/university";
import { UsersModule } from "modules/users";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UniversityModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const options = getDataSourceOptions();
        return {
          ...options,
          entities: undefined,
          autoLoadEntities: true,
          migrations: undefined,
        };
      },
    }),
  ],
  controllers: [AuthController, UsersController, UniversitiesController],
  providers: [],
})
export class AppModule {}
