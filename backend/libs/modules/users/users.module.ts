import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PhotoModule } from "modules/photo/photo.module";

import { User } from "./entities";
import { UsersService } from "./providers/services";

@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotoModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
