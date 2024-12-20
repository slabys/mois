import { ApiHideProperty } from "@nestjs/swagger";
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrganizationMember } from "./organization-member.entity";
import { User } from "modules/users";
import { Address } from "modules/addresses";

@Entity()
@Check("(SELECT COUNT(*) FROM organization WHERE parent.id IS NULL) <= 1")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Address, { nullable: false, cascade: true, eager: true })
  address: Address;

  // Relations
  @ApiHideProperty()
  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  manager: User | null;

  @ApiHideProperty()
  @Index()
  @ManyToOne(() => Organization, (organization) => organization.children)
  parent: Organization | null;

  @ApiHideProperty()
  @OneToMany(() => Organization, (organization) => organization.parent)
  children: Organization[] | null;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;
}
