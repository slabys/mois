import { ApiHideProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrganizationMember } from "./organization-member.entity";
import { User } from "modules/users";
import { Address } from "modules/addresses";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Address, { nullable: false, eager: true })
  address: Address;

  // Relations
  @ApiHideProperty()
  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  manager: User | null;

  @ApiHideProperty()
  @ManyToOne(() => Organization, (organization) => organization.children)
  parent: Organization | null;

  @ApiHideProperty()
  @OneToMany(() => Organization, (organization) => organization.parent)
  children: Organization[] | null;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;
}
