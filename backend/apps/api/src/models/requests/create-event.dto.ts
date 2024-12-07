import {
  Allow,
  IsInt,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";
import { IsValidJsonSchema } from "utilities/nest/class-validator";

export class CreateEvent {
  @MinLength(6)
  title: string;

  @Allow()
  since: Date;

  @Allow()
  until: Date;

  @Allow()
  registrationDeadline: Date;

  @MinLength(30)
  longDescription: string;

  @MinLength(30)
  shortDescription: string;

  @Allow()
  visible?: boolean = true;

  /**
   * Additional registration properties
   * ! Must be valid JSON schema
   */
  @IsOptional()
  @IsValidJsonSchema()
  registrationForm?: object;

  /**
   * Generate invoices after {@link registrationDeadline}
   */
  @Allow()
  generateInvoices: boolean;

  /**
   * Event capacity
   */
  @Min(0)
  @IsInt()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  capacity: number;

  @IsUrl()
  termsAndConditionsLink: string;

  @IsUrl()
  photoPolicyLink: string;

  @IsUrl()
  codeOfConductLink: string;
}
