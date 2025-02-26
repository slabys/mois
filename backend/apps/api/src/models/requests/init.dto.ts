import { CreateUser } from "./create-user.dto";
import { IsNotEmptyObject } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrganization } from "./create-organization.dto";

export class InitializeType {
	@IsNotEmptyObject()
	@Type(() => CreateUser)
	user: CreateUser;

	@IsNotEmptyObject()
	@Type(() => CreateOrganization)
	organization: CreateOrganization;
}
