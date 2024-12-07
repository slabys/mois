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

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // Relations
  @ApiHideProperty()
  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

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
