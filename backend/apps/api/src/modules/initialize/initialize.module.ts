import { Module } from "@nestjs/common";
import { InitializeService } from "./providers/services";
import { InitializeController } from "../../controllers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users";
import { Organization } from "../organization";
import { OrganizationMember } from "../organization/entities";
import { Address } from "../addresses";
import { Role } from "../roles";

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
