import { IsEmail, MinLength } from "class-validator";

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
}
