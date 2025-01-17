import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CookieGuard } from "modules/auth/providers/guards";
import { Permission, Role, RolesService } from "modules/roles";
import { CurrentUser } from "../decorators";
import type { User } from "modules/users";
import { CreateRole } from "../models/requests/create-role.dto";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(CookieGuard)
@Controller("roles")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {
	}

	@ApiCreatedResponse({ type: Role, description: "Created role" })
	@Post("create")
	async createRole(@CurrentUser() user: User, @Body() body: CreateRole) {

		console.log(body);

		let role = new Role({
			name: body.name,
			permissions: body.permissions,
		});

		return await this.rolesService.save(role);
	}

	/**
	 * All available roles to assign
	 */
	@ApiOkResponse({ type: [Role] })
	@Get()
	getAllRoles() {
		return this.rolesService.findAll();
	}

	/**
	 * Get all allowed permissions registered in system
	 */
	@ApiOkResponse({
		description: "Returns permissions",
		schema: {
			type: "array",
			items: {
				type: "string",
				enum: Object.values(Permission), // Include all enum values
			},
		},
	})
	@Get("permissions")
	getRoleAllPermissions() {
		return Object.values(Permission);
	}
}
