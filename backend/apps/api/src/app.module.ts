import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import {
  AuthController,
  OrganizationMembersController,
  OrganizationsController,
  PhotoController,
  UniversitiesController,
  UsersController,
} from "./controllers";

import { AuthModule } from "modules/auth";
import { PhotoModule } from "modules/photo";
import { UniversityModule } from "modules/university";
import { UsersModule } from "modules/users";
import { NestjsFormDataModule } from "nestjs-form-data";
import { OrganizationModule } from "modules/organization";
import { EventsModule } from "modules/events";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UniversityModule,
    PhotoModule,
    OrganizationModule,
    EventsModule,
    NestjsFormDataModule.config({}),
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
  controllers: [
    AuthController,
    UsersController,
    UniversitiesController,
    PhotoController,
    OrganizationsController,
    OrganizationMembersController,
  ],
  providers: [],
})
export class AppModule {}
