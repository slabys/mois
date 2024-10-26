import { IsEmail, MinLength } from "class-validator";

export class LoginUser {
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
