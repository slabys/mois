import { OrganizationMember } from "modules/organization/entities";
import { Photo } from "modules/photo";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventSpot } from "./event-spot.entity";
import { EventApplication } from "./event-application.entity";

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

  @ManyToOne(() => OrganizationMember, { nullable: false })
  createdBy: OrganizationMember;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Photo, { nullable: true })
  photo: Photo | null;

  @OneToMany(() => EventSpot, (spot) => spot.event, { cascade: true })
  spotTypes: EventSpot[];

  @OneToMany(() => EventApplication, (application) => application.spotType)
  applications: EventApplication[];

  @Column({ default: true })
  visible: boolean;

  constructor(event?: Partial<Event>) {
    super();

    Object.assign(this, event);
  }
}
