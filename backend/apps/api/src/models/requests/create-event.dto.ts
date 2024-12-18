import {
  Allow,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";
import { IsValidJsonSchema } from "utilities/nest/class-validator";

export class CreateEvent {
  @MinLength(6)
  @IsString()
  title: string;

  @IsDate()
  since: Date;

  @IsDate()
  until: Date;

  @IsDate()
  registrationDeadline: Date;

  @IsString()
  @MinLength(30)
  longDescription: string;

  @IsString()
  @MinLength(30)
  shortDescription: string;

  @IsBoolean()
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
  @IsBoolean()
  generateInvoices: boolean;

  /**
   * Event capacity
   */
  @Min(0)
  @IsInt()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  capacity: number;

  /**
   * @example https://test.cz
   */
  @IsUrl()
  termsAndConditionsLink: string;

  /**
   * @example https://test.cz
   */
  @IsUrl()
  photoPolicyLink: string;

  /**
   * @example https://test.cz
   */
  @IsUrl()
  codeOfConductLink: string;
}
