import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import {
  AuthController,
  EventApplicationsController,
  EventSpotsController,
  EventsController,
  HealthController,
  InvoiceController,
  OrganizationMembersController,
  OrganizationsController,
  PhotoController,
  RolesController,
  UsersController,
} from "./controllers";

import { AuthModule } from "modules/auth";
import { EventsModule } from "modules/events";
import { OrganizationModule } from "modules/organization";
import { PhotoModule } from "modules/photo";
import { UsersModule } from "modules/users";
import { NestjsFormDataModule } from "nestjs-form-data";
import { InvoiceModule } from "modules/invoice";

import { ManagementControllers } from "./controllers/management";
import { FileStorageModule } from "modules/file-storage";
import { RolesModule } from "modules/roles";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PhotoModule,
    OrganizationModule,
    EventsModule,
    NestjsFormDataModule.config({}),
    InvoiceModule,
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
    FileStorageModule,
    RolesModule,
  ],
  controllers: [
    AuthController,
    UsersController,
    PhotoController,
    OrganizationsController,
    OrganizationMembersController,
    EventApplicationsController,
    EventsController,
    EventSpotsController,
    InvoiceController,
    RolesController,
    ...ManagementControllers,
    HealthController,
  ],
  providers: [],
})
export class AppModule {}
