import { Allow, IsNotEmpty, Matches } from "class-validator";

export class CreateAddress {
  @Allow()
  @IsNotEmpty()
  city: string;

  @Allow()
  @IsNotEmpty()
  country: string;

  @Allow()
  @IsNotEmpty()
  street: string;

  /**
   * House number with entrance support
   *
   * @example 145
   * @example 145/5
   */
  @Matches(/^(\d+)(\/\d+)?$/)
  @IsNotEmpty()
  houseNumber: string;

  @Allow()
  @IsNotEmpty()
  zip: string;
}
