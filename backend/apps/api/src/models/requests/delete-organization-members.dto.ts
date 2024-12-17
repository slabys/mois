import { Allow } from "class-validator";

export class DeleteOrganizationMembers {
  @Allow()
  memberIds: number[];
}
