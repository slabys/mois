import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AddressesModule } from "modules/addresses";
import { PhotoModule } from "modules/photo/photo.module";

import { User } from "./entities";
import { UsersService } from "./providers/services";

@Module({
	imports: [TypeOrmModule.forFeature([User]), PhotoModule, AddressesModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
