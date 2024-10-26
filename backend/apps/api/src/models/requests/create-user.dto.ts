import { Allow, IsEmail, MinLength } from "class-validator";

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

  @MinLength(6)
  username: string;
}
