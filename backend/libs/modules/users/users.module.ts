import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PhotoModule } from "modules/photo/photo.module";
import { UniversityModule } from "modules/university";

import { User } from "./entities";
import { UsersService } from "./providers/services";

@Module({
  imports: [TypeOrmModule.forFeature([User]), UniversityModule, PhotoModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
