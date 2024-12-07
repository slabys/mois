import { Allow, Matches } from "class-validator";

export class CreateAddress {
  @Allow()
  city: string;

  @Allow()
  country: string;

  @Allow()
  street: string;

  /**
   * House number with entrance support
   *
   * @example 145
   * @example 145/5
   */
  @Matches(/^(\d+)(\/\d+)?$/)
  houseNumber: string;

  @Allow()
  zip: string;
}
