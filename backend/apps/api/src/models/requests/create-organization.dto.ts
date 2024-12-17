import { Allow, IsNotEmpty, IsObject } from "class-validator";
import { CreateAddress } from "./create-address.dto";
import { Type } from "class-transformer";

export class CreateOrganization {
  @Allow()
  name: string;

  @IsNotEmpty()
  @IsObject()
  @Type(() => CreateAddress)
  address: CreateAddress;
}
