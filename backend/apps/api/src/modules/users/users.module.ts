import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AddressesModule } from "../addresses";
import { PhotoModule } from "@api/modules/photo";

import { User } from "./entities";
import { UsersService } from "./users.service";

@Module({
	imports: [TypeOrmModule.forFeature([User]), PhotoModule, AddressesModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {
}
