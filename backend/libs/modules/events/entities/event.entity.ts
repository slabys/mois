import { OrganizationMember } from "modules/organization/entities";
import { Photo } from "modules/photo";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  since: Date;

  @Column()
  until: Date;

  @ManyToOne(() => OrganizationMember)
  createdBy: OrganizationMember;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Photo, { nullable: true })
  photo: Photo | null;

  constructor(event?: Partial<Event>) {
    super();
    Object.assign(this, event);
  }
}
