import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import {
  AuthController,
  PhotoController,
  UniversitiesController,
  UsersController,
} from "./controllers";

import { AuthModule } from "modules/auth";
import { UniversityModule } from "modules/university";
import { UsersModule } from "modules/users";
import { NestjsFormDataModule } from "nestjs-form-data";
import { PhotoModule } from "modules/photo";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UniversityModule,
    PhotoModule,
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
  ],
  providers: [],
})
export class AppModule {}
