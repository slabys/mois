import {
  Allow,
  IsEmail,
  IsEnum,
  IsOptional,
  Matches,
  MinLength,
} from "class-validator";
import { UserGender } from "modules/users/enums";
import { CreateAddress } from "./create-address.dto";
import { Type } from "class-transformer";

export class CreateUser {
  /**
   * User email
   */
  @IsEmail()
  email: string;

  /**
   * User password
   */
  @MinLength(6)
  password: string;

  /**
   * First name
   */
  @Allow()
  firstName: string;

  /**
   * Last name
   */
  @Allow()
  lastName: string;

  /**
   * Must not contain special characters
   */
  @Matches(/^[a-zA-Z0-9]+$/)
  @MinLength(6)
  username: string;

  /**
   * User gender
   */
  @IsEnum(UserGender)
  gender: UserGender = UserGender.PreferNotToSay;

  @IsOptional()
  @Type(() => CreateAddress)
  personalAddress?: CreateAddress | undefined | null;
}
