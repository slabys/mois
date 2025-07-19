import { Module } from "@nestjs/common";
import { InitializeService } from "./providers/services";
import { InitializeController } from "@api/controllers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UsersModule } from "@api/modules/users";
import { Organization } from "@api/modules/organization";
import { OrganizationMember } from "@api/modules/organization/entities";
import { Address } from "@api/modules/addresses";
import { Role } from "@api/modules/roles";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@api/modules/auth";
import { MailModule } from "@api/modules/mail/mail.module";

@Module({
	imports: [
		UsersModule,
		MailModule,
		AuthModule,
		ConfigModule,
		TypeOrmModule.forFeature([User, Organization, OrganizationMember, Address, Role]),
	],
	controllers: [InitializeController],
	providers: [InitializeService],
	exports: [InitializeService],
})

export class InitializeModule {
}
