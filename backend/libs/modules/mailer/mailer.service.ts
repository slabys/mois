import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { SendEmailDTO } from "../../../apps/api/src/models/requests/send-mail.dto";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailerService {
	constructor(private readonly configService: ConfigService) {
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

	templateReplacer(html: string, replacements: Record<string, string>) {
		return html.replace(
			/{(\w*)}/g,
			(_, key) => {
				return replacements.hasOwnProperty(key) ? replacements[key] : "";
			});
	}

	async sendMail(dto: SendEmailDTO) {
		const { from, recipient, subject } = dto;
		const html = dto.placeholderReplacement ? this.templateReplacer(dto.html, dto.placeholderReplacement) : dto.html;


		const transporter = this.mailTransport();
		const options: Mail.Options = {
			from: from ?? {
				name: "",
				address: this.configService.get<string>("MAIL_USER"),
			},
			to: recipient,
			subject: subject,
			html: html,
		};
		try {
			return await transporter.sendMail(options);
		} catch (error) {
			console.error(error);
		}
	}
}
