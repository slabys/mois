import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { InitializeType } from "../models/requests";
import { InitializeService } from "modules/initialize/providers/services";

@ApiTags("Initialize")
@Controller("initialize")
export class InitializeController {

	constructor(
		private readonly InitializeService: InitializeService,
	) {
	}

	@Get()
	async getInitialized() {
		return this.InitializeService.checkInitialization();
	}

	@ApiCreatedResponse({ type: InitializeType, description: "Initialization created successfully" })
	@Post()
	async createInitialState(@Body() body: InitializeType) {
		return this.InitializeService.initializeSystem(body);
	}

}
