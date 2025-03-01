import { Address } from "nodemailer/lib/mailer";

export class SendEmailDTO {
	from?: Address;
	recipient?: Address[];
	subject?: string;
	html: string;
	text?: string;
	placeholderReplacement?: Record<string, string>;
}
