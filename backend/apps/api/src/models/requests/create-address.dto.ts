import { IsString, Matches } from "class-validator";

export class CreateAddress {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  street: string;

  /**
   * House number with entrance support
   *
   * @example 145
   * @example 145/5
   */
  @IsString()
  @Matches(/^(\d+)(\/\d+)?$/)
  houseNumber: string;
  
  @IsString()
  zip: string;
}
