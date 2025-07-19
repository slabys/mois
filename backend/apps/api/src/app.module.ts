import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "../config/typeorm.config";
import {
	AuthController,
	EventApplicationsController,
	EventsController,
	EventSpotsController,
	HealthController,
	InitializeController,
	OrganizationMembersController,
	OrganizationsController,
	PhotoController,
	RolesController,
	UsersController,
} from "./controllers";

import { AuthModule } from "./modules/auth";
import { EventsModule } from "./modules/events";
import { FileStorageModule } from "./modules/file-storage";
import { OrganizationModule } from "./modules/organization";
import { PhotoModule } from "./modules/photo";
import { RolesModule } from "./modules/roles";
import { UsersModule } from "./modules/users";
import { InitializeModule } from "./modules/initialize";
import { NestjsFormDataModule } from "nestjs-form-data";

import { ManagementControllers } from "./controllers/management";
import { EventApplicationSimpleWithApplicationsMapper, EventSimpleWithApplicationsMapper } from "./mappers";
import { MailModule } from "@api/modules/mail/mail.module";
import { ConfigModule } from "@nestjs/config";


@Module({
	imports: [
		InitializeModule,
		AuthModule,
		UsersModule,
		PhotoModule,
		OrganizationModule,
		EventsModule,
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
		FileStorageModule,
		RolesModule,
		ConfigModule.forRoot(),
		MailModule,

	],
	controllers: [
		InitializeController,
		AuthController,
		UsersController,
		PhotoController,
		OrganizationsController,
		OrganizationMembersController,
		EventApplicationsController,
		EventsController,
		EventSpotsController,
		RolesController,
		...ManagementControllers,
		HealthController,
	],
	providers: [EventSimpleWithApplicationsMapper, EventApplicationSimpleWithApplicationsMapper],
})
export class AppModule {
}
