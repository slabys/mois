import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { OrganizationMember } from "./organization-member.entity";

@Entity()
export class Organization {
  // Data columns
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;


  // Relations
  @ManyToOne(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @ManyToOne(() => Organization, (organization) => organization.children)
  parent: Organization | null;

  @OneToMany(() => Organization, (organization) => organization.parent)
  children: Organization[] | null;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;
}
