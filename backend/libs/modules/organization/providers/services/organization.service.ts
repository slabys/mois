import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, In, Repository } from "typeorm";

import { FindManyOptions } from "libs/types";
import {
  Organization,
  OrganizationMember,
} from "modules/organization/entities";
import { User } from "modules/users";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  /**
   * Find organization by ID
   * @param id Organization ID
   * @returns
   */
  findById(id: string) {
    return this.organizationRepository.findOneBy({ id });
  }

  /**
   * Save organization data
   * @param data
   * @returns
   */
  save(data: Partial<Organization>) {
    return this.organizationRepository.save(data);
  }

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
  findMemberByUserId(
    organizationId: string,
    userId: string,
    options?: FindOneOptions<OrganizationMember>
  ) {
    return this.memberRepository.findOne({
      where: {
        organization: {
          id: organizationId,
        },
        user: {
          id: userId,
        },
      },
      relations: options?.relations,
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

  /**
   * Add new members to the organization
   * @param organization Organization
   * @param addMembers Members
   * @returns
   */
  async addMembers(organization: Organization, addMembers: User[]) {
    return this.entityManager.transaction(async (em) => {
      const alreadyMembers = await em
        .createQueryBuilder(OrganizationMember, "member")
        .leftJoinAndSelect("member.user", "user")
        .where("member.user.id IN (:...userIds)", {
          userIds: addMembers.map((e) => e.id),
        })
        .getMany();
      const alreadyMembersIds = alreadyMembers.map((e) => e.user.id);

      const newMembers = addMembers.filter(
        (e) => !alreadyMembersIds.includes(e.id)
      );

      return em.save(
        newMembers.map((user) =>
          em.create(OrganizationMember, { user, organization })
        )
      );
    });
  }

  /**
   * Delete members by ID
   * @param organization Organization
   * @param memberIds Member Ids
   */
  async deleteMembers(organization: Organization, memberIds: number[]) {
    await this.memberRepository.delete({ organization, id: In(memberIds) });
  }
}
