import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../permissions";

@Entity()
export class Role {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	name: string;

	@Column({ enum: Permission, array: true, type: "enum" })
	permissions: Permission[];

	hasPermission(userPermission: Permission) {
		return this.permissions.includes(userPermission);
	}

	hasOneOfPermissions(userPermissions: Permission[]) {
		return userPermissions.some((permission) => this.permissions.includes(permission));
	}

	constructor(role?: Partial<Role>) {
		Object.assign(this, role);
	}
}
