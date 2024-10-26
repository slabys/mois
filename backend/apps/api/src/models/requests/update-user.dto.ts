import { PartialType, PickType } from "@nestjs/swagger";
import { CreateUser } from "./create-user.dto";

export class UpdateUser extends PartialType(
  PickType(CreateUser, ["password", "firstName", "lastName", "username"])
) {}
