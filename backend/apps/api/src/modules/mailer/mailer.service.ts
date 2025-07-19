import { BadRequestException, Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import Mail from "nodemailer/lib/mailer";
import { SendEmailDTO } from "@api/models/requests/send-mail.dto";


import { MailerService as NestMailerModule } from "@nestjs-modules/mailer";

@Injectable()
export class MailerService {
	constructor(
		private readonly configService: ConfigService,
		private readonly mailerService: NestMailerModule,
	) {
	}

	testSend() {
		this.mailerService.sendMail({
			to: "info@slabys.cz",
			from: "admin_ers@esncz.org",
			subject: "Testing Nest Mailermodule with template ✔",
			template: "basic",
			context: {
				name: "John Doe",
			},
		})
			.then((value) => {
				console.log(value);
			})
			.catch((reason) => {
				console.log(reason);
			});
	}

	mailTransport() {
		return nodemailer.createTransport({
			service: "gmail",
			host: this.configService.get<string>("MAIL_HOST"),
			port: 465,
			secure: true,
			auth: {
				user: this.configService.get<string>("MAIL_USER"),
				pass: this.configService.get<string>("MAIL_PASS"),
			},
		});
	}

	// Replaces the variables with values e.g. "Hello {name}" --> "Hello Joe"
	templateReplacer(html: string, replacements: Record<string, string>) {
		return html.replace(
			/{(\w*)}/g,
			(_, key) => {
				return replacements.hasOwnProperty(key) ? replacements[key] : "";
			});
	}

	async sendMail(dto: SendEmailDTO) {
		const { subject, recipients, html: htmlContent, placeholderReplacement, text } = dto;
		const html = placeholderReplacement ? this.templateReplacer(htmlContent, placeholderReplacement) : text;


		const transporter = this.mailTransport();
		const options: Mail.Options = {
			from: {
				name: "No Reply",
				address: this.configService.get<string>("MAIL_USER"),
			},
			to: this.configService.get<string>("MAIL_USER"),
			bcc: recipients,
			subject: subject,
			html: html,
		};

		try {
			return await transporter.sendMail(options);
		} catch (error) {
			console.error(error);
			throw new BadRequestException();
		}
	}
}
