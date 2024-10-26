import { IntersectionType, PickType } from "@nestjs/swagger";
import { User } from "modules/users";
import { CreateUser } from "./create-user.dto";

// May come handy in the future
class UpdateUserEntityColumns extends PickType(User, []) {}
class UpdateUserPassword extends PickType(CreateUser, ["password"]) {}

export class UpdateUser extends IntersectionType(
  UpdateUserEntityColumns,
  UpdateUserPassword
) {}
