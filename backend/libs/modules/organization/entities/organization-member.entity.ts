import { User } from "modules/users";
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./organization.entity";
import { Role, type Permission } from "modules/roles";

@Entity()
export class OrganizationMember {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToMany(() => Role, { onDelete: "CASCADE", eager: true })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Organization, (organization) => organization.members)
  organization: Organization;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  hasPermission(permission: Permission) {
    return this.roles.some((e) => e.hasPermission(permission));
  }
}
