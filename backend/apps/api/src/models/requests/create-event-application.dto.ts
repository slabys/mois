import { Type } from "class-transformer";
import { Allow } from "class-validator";
import { CreateAddress } from "./create-address.dto";

export class CreateEventApplication {
  @Allow()
  spotTypeId: number;

  @Allow()
  additionalFormData: object = {};

  @Allow()
  @Type(() => CreateAddress)
  invoiceAddress: CreateAddress;

  @Allow()
  idNumber: string;
}
