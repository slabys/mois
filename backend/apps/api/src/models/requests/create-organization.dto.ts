import { Type } from "class-transformer";
import { Allow, IsNotEmptyObject, IsObject, IsString } from "class-validator";
import { CreateAddress } from "./create-address.dto";

export class CreateOrganization {
	@Allow()
	@IsString()
	name: string;

	@IsString()
	cin: string | null;

	@IsNotEmptyObject()
	@IsObject()
	@Type(() => CreateAddress)
	address: CreateAddress;
}
