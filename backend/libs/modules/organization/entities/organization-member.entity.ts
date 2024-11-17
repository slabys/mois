import { User } from "modules/users";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./organization.entity";

@Entity()
export class OrganizationMember {
  @PrimaryGeneratedColumn()
  id: string;
  // TODO: Define own roles?
  @Column()
  roles: string[];

  @OneToMany(() => Organization, (organization) => organization.members)
  organization: Organization;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
