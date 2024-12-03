import { Allow, IsEmail, Matches, MinLength } from "class-validator";

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
}
