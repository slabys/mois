import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { SendEmailDTO } from "@api/models/requests/send-mail.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CookieGuard } from "@api/modules/auth/providers/guards";
import { CurrentUser } from "@api/decorators";
import type { User } from "@api/modules/users";

@ApiTags("Mailer")
@Controller("mailer")
export class MailerController {
	constructor(private readonly mailerService: MailerService) {
	}

	/**
	 * Send e-mail
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@ApiOkResponse({ description: "E-mail sent" })
	@ApiBadRequestResponse({ type: Error, description: "E-mail not sent" })
	@Post()
	async sendMail(@Body() body: SendEmailDTO, @CurrentUser() user: User) {

		if (user.role.isAdmin()) {

		}

		this.mailerService.testSend();
		// return await this.mailerService.sendMail(body);
	}

}
