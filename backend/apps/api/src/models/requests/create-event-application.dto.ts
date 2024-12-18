import { Type } from "class-transformer";
import { Allow, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { CreateAddress } from "./create-address.dto";
import { ApiExtraModels, ApiProperty, refs } from "@nestjs/swagger";

export class CreateEventApplicationExistingOrganization {
  /**
   * Organization ID
   */
  @Allow()
  id: string;

  @ApiProperty({
    type: "string",
    default: "organization",
    enum: ["organization"],
  })
  type: "organization" = "organization" as const;
}

export class CreateEventApplicationCustomOrganization {
  @Allow()
  name: string;

  @Allow()
  country: string;

  @ApiProperty({
    type: "string",
    default: "custom",
    enum: ["custom"],
  })
  type: "custom" = "custom" as const;
}

@ApiExtraModels(
  CreateEventApplicationExistingOrganization,
  CreateEventApplicationCustomOrganization
)
export class CreateEventApplication {
  @IsNumber()
  @IsOptional()
  spotTypeId?: number | null;

  @IsOptional()
  @IsObject()
  additionalFormData: object = {};

  @IsObject()
  @IsNotEmptyObject({ nullable: false })
  @Type(() => CreateAddress)
  invoiceAddress: CreateAddress;

  @IsString()
  idNumber: string;

  @ApiProperty({
    type: () => Object,
    oneOf: refs(
      CreateEventApplicationExistingOrganization,
      CreateEventApplicationCustomOrganization
    ),
  })
  @IsObject()
  @IsNotEmptyObject()
  @Type(null, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        {
          name: "organization",
          value: CreateEventApplicationExistingOrganization,
        },
        {
          name: "custom",
          value: CreateEventApplicationCustomOrganization,
        },
      ],
    },
  })
  organization:
    | CreateEventApplicationExistingOrganization
    | CreateEventApplicationCustomOrganization;
}
