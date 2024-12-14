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

import { hashPassword } from "modules/auth/utilities/crypto";
import { Photo } from "modules/photo/entities";
import { UserGender } from "../enums";
import { Address } from "modules/addresses";

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

  @Column({
    type: "enum",
    enum: UserGender,
    default: UserGender.PreferNotToSay,
  })
  gender: UserGender;

  // Exclude property from generated docs
  @ApiHideProperty()
  @Exclude()
  @Column({ type: "varchar", length: 255, select: false })
  password: string;

  @ManyToOne(() => Photo, { eager: true })
  photo: Photo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Address, { onDelete: "SET NULL", cascade: true })
  personalAddress: Address;

  @BeforeUpdate()
  @BeforeInsert()
  async beforeSave() {
    if (this.password) this.password = await hashPassword(this.password);
  }

  constructor(partial?: DeepPartial<User>) {
    super();
    Object.assign(this, partial);
  }
}
