import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import {
  AuthController,
  EventSpotsController,
  EventsController,
  HealthController,
  OrganizationMembersController,
  OrganizationsController,
  PhotoController,
  UsersController,
} from "./controllers";

import { AuthModule } from "modules/auth";
import { EventsModule } from "modules/events";
import { OrganizationModule } from "modules/organization";
import { PhotoModule } from "modules/photo";
import { UsersModule } from "modules/users";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [
    AuthModule,
    UsersModule,
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
    PhotoController,
    OrganizationsController,
    OrganizationMembersController,
    EventsController,
    EventSpotsController,
    HealthController,
  ],
  providers: [],
})
export class AppModule {}
