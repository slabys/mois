import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("test")
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiBearerAuth()
	@Get()
	retrieveUser(): string {
		return this.appService.getHello();
	}

	@Post()
	gette(): string {
		return "YO";
	}
}
