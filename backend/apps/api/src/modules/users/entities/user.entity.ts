import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	type DeepPartial,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { hashPassword } from "../../auth/utilities/crypto";
import { Photo } from "@api/modules/photo";
import { UserGender } from "../enums";
import { Role } from "../../roles";
import { Address } from "@api/modules/addresses/entities";

@Index(["email", "username"])
@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Index()
	@Column({ unique: true })
	email: string;

	@Index()
	@Column({ unique: true })
	username: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	birthDate: Date;

	@Column({ nullable: true })
	nationality: string;

	@Column({ nullable: true })
	phonePrefix: string;

	@Column({ nullable: true })
	phoneNumber: string;

	@Column({
		type: "enum",
		enum: UserGender,
		default: UserGender.PreferNotToSay,
	})
	gender: UserGender;

	@Column({ nullable: true })
	pronouns: string | null;

	// Exclude property from generated docs
	@ApiHideProperty()
	@Exclude()
	@Column({ type: "varchar", length: 255, select: false })
	password: string;

	@ManyToOne(() => Photo, { eager: true, onDelete: "SET NULL" })
	photo: Photo | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Address, { nullable: true, onDelete: "SET NULL", cascade: true })
	personalAddress: Address | null;

	@ManyToOne(() => Role, { cascade: true, eager: true, onDelete: "SET NULL" })
	role: Role | null;

	@BeforeUpdate()
	@BeforeInsert()
	async beforeSave() {
		if (this.password) this.password = await hashPassword(this.password);
		if (this.username) this.username = this.username.toLowerCase();
	}

	constructor(partial?: DeepPartial<User>) {
		super();
		Object.assign(this, partial);
	}

	@Column({ default: false })
	isVerified: boolean;
}
