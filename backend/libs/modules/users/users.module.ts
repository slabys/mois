import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UniversityModule } from "modules/university";
import { User } from "./entities";
import { UsersService } from "./providers/services";

@Module({
  imports: [TypeOrmModule.forFeature([User]), UniversityModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
