import { Allow, MinLength } from "class-validator";

export class LoginUser {
  /**
   * User email or username
   */
  @Allow()
  email: string;
  
  /**
   * User password
   */
  @Allow()
  @MinLength(6)
  password: string;
}
