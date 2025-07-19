import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { InitializeType } from "@api/models/requests";
import { InitializeService } from "@api/modules/initialize/providers/services";
import { UsersService } from "@api/modules/users";

@ApiTags("Initialize")
@Controller("initialize")
export class InitializeController {

	constructor(
		private readonly initializeService: InitializeService,
		private readonly usersService: UsersService,
	) {
	}

	@Get()
	async getInitialized() {
		return this.initializeService.checkInitialization();
	}

	@ApiCreatedResponse({ type: InitializeType, description: "Initialization created successfully" })
	@Post()
	async createInitialState(@Body() body: InitializeType) {
		return this.initializeService.initializeSystem(body);
	}

}
