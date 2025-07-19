import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MailerController } from "./mailer.controller";
import { ConfigModule } from "@nestjs/config";
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
	imports: [ConfigModule, NestMailerModule.forRoot({
		transport: {
			service: "gmail",
			host: process.env.MAIL_HOST,
			port: 465,
			secure: true,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		},
		template: {
			dir: process.cwd() + "/templates",
			adapter: new HandlebarsAdapter(),
			options: {
				strict: true,
			},
		},
	})],
	controllers: [MailerController],
	providers: [MailerService],
	exports: [MailerService],
})
export class MailerModule {
}
