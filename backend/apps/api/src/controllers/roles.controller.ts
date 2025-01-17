import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CookieGuard } from "modules/auth/providers/guards";
import { Permission, Role, RolesService } from "modules/roles";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(CookieGuard)
@Controller("roles")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

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
