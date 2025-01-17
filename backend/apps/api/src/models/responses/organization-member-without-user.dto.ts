import { OmitType } from "@nestjs/swagger";
import { OrganizationMember } from "modules/organization/entities";

export class OrganizationMemberWithoutUser extends OmitType(OrganizationMember, ["user"]) {}
