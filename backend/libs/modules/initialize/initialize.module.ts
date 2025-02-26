import { Module } from "@nestjs/common";
import { InitializeService } from "modules/initialize/providers/services";
import { InitializeController } from "apps/api/src/controllers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "modules/users";
import { Organization } from "modules/organization";
import { OrganizationMember } from "modules/organization/entities";
import { Address } from "modules/addresses";
import { Role } from "modules/roles";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Organization, OrganizationMember, Address, Role]),
	],
	controllers: [InitializeController],
	providers: [InitializeService],
	exports: [InitializeService],
})

export class InitializeModule {
}
