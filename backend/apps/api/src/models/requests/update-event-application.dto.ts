import { ApiExtraModels, ApiProperty, PartialType, PickType, refs } from "@nestjs/swagger";
import { CreateEventApplication } from "./create-event-application.dto";
import { IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateEventApplicationExistingOrganization {
	@IsString()
	id: string;

	@ApiProperty({
		type: "string",
		default: "organization",
		enum: ["organization"],
	})
	type: "organization" = "organization" as const;
}

export class UpdateEventApplicationCustomOrganization {
	@IsNumber()
	@IsOptional()
	id?: number;

	@IsString()
	name: string;

	@IsString()
	country: string;

	@ApiProperty({
		type: "string",
		default: "custom",
		enum: ["custom"],
	})
	type: "custom" = "custom" as const;
}

@ApiExtraModels(UpdateEventApplicationExistingOrganization, UpdateEventApplicationCustomOrganization)
export class UpdateEventApplication extends PartialType(
	PickType(CreateEventApplication, ["idNumber", "validUntil", "invoicedTo", "invoiceMethod", "foodRestrictionAllergies", "healthLimitations", "additionalInformation"]),
) {
	@ApiProperty({
		type: () => Object,
		oneOf: refs(UpdateEventApplicationExistingOrganization, UpdateEventApplicationCustomOrganization),
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
					value: UpdateEventApplicationExistingOrganization,
				},
				{
					name: "custom",
					value: UpdateEventApplicationCustomOrganization,
				},
			],
		},
	})
	organization: UpdateEventApplicationExistingOrganization | UpdateEventApplicationCustomOrganization;
}