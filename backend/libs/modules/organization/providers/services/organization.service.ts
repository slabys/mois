import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Organization,
  OrganizationMember,
} from "modules/organization/entities";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>
  ) {}

  /**
   * Find all organizations
   * @returns {Organization[]} Organizations
   */
  findAll() {
    return this.organizationRepository.findBy({});
  }

  /**
   * Find all members of organization
   * @param id Organization ID
   * @returns {OrganizationMember[]} Members
   */
  findMembersOf(id: string) {
    return this.memberRepository.find({
      where: {
        organization: {
          id,
        },
      },
      relations: {
        user: true,
      },
    });
  }

  /**
   * Find organization user membership
   * @param organizationId Organization ID
   * @param userId User ID
   * @returns {OrganizationMember | null} Membership
   */
  findMemberByUserId(organizationId: string, userId: string) {
    return this.memberRepository.findOne({
      where: {
        organization: {
          id: organizationId,
        },
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * Find memberships where user is member of
   * @param userId User ID
   * @returns {OrganizationMember}
   */
  findUserMemberships(userId: string) {
    return this.memberRepository.find({
      where: { user: { id: userId } },
      relations: {
        organization: true,
      },
    });
  }
}
