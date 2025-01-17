import { Column, Entity, PrimaryColumn } from "typeorm";
import { Permission } from "../permissions";

@Entity()
export class Role {
	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@Column({ enum: Permission, array: true, type: "enum" })
	permissions: Permission[];

	hasPermission(permission: Permission) {
		return this.permissions.includes(permission);
	}
}
