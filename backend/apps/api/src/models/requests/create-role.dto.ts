import { IsOptional, IsString } from "class-validator";
import { Permission } from "modules/roles";

export class CreateRole {
	@IsString()
	name: string;

	@IsOptional()
	permissions?: Permission[] = [];
}
