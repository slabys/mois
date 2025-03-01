import { Body, Controller, Get } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { SendEmailDTO } from "../../../apps/api/src/models/requests/send-mail.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Mailer")
@Controller("mailer")
export class MailerController {
	constructor(private readonly mailerService: MailerService) {
	}

	@Get()
	async sendMail(@Body() body?: Record<string, string>) {
		const mailDto: SendEmailDTO = {
			recipient: [{ name: "", address: "" }],
			subject: "Subject",
			html: `<p>HTML message</p>`,
			placeholderReplacement: body,
		};
		return await this.mailerService.sendMail(mailDto);
	}

}
