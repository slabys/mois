import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FindManyOptions } from "libs/types";
import {
  Organization,
  OrganizationMember,
} from "modules/organization/entities";

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
  findAll(options?: FindManyOptions) {
    return this.organizationRepository.find({
      take: options?.pagination?.take,
      skip: options?.pagination?.skip,
    });
  }

  /**
   * Find all members of organization
   * @param id Organization ID
   * @param options Find options
   * @returns {OrganizationMember[]} Members
   */
  findMembersOf(id: string, options?: FindManyOptions) {
    return this.memberRepository.find({
      where: {
        organization: {
          id,
        },
      },
      relations: {
        user: true,
      },
      skip: options?.pagination?.skip,
      take: options?.pagination?.take,
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
  findUserMemberships(userId: string, options?: FindManyOptions) {
    return this.memberRepository.find({
      where: { user: { id: userId } },
      relations: {
        organization: true,
      },
      take: options?.pagination?.take,
      skip: options?.pagination?.skip,
    });
  }
}
