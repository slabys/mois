import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  BeforeInsert,
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

  @BeforeInsert()
  async beforeSave() {
    this.password = await hashPassword(this.password);
  }

  constructor(partial?: DeepPartial<User>) {
    super();
    Object.assign(this, partial);
  }
}
