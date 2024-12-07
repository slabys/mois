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
import { EventLink } from "./event-link.entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  // Select only short description by default
  @Column({ select: false })
  longDescription: string;

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

  @OneToMany(() => EventLink, (link) => link.event)
  links: EventLink[];

  @Column({ default: true })
  visible: boolean;

  @Column()
  registrationDeadline: Date;

  /**
   * If true, generate invoices after {@link registrationDeadline}
   */
  @Column({ default: true })
  generateInvoices: boolean;

  /**
   * Additional registration form
   * Each event can have different "requirements"
   */
  @Column("json", { default: {}, select: false })
  registrationForm: object;

  /**
   * Event capacity
   */
  @Column({ unsigned: true })
  capacity: number;

  constructor(event?: Partial<Event>) {
    super();

    Object.assign(this, event);
  }
}
