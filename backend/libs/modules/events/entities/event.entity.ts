import { Photo } from "modules/photo";
import { User } from "modules/users";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventApplication } from "./event-application.entity";
import { EventLink } from "./event-link.entity";
import { EventSpot } from "./event-spot.entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

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

  @ManyToOne(() => User, { nullable: false })
  createdByUser: User;

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
  @Column({ default: true, select: false })
  generateInvoices: boolean;

  /**
   * Additional registration form
   * Each event can have different "requirements"
   */
  @Column("json", { nullable: true, select: false })
  registrationForm: object | null;

  /**
   * Event capacity
   */
  @Column({ unsigned: true })
  capacity: number;

  /** Links */

  @Column({ select: false })
  termsAndConditionsLink: string;

  @Column({ select: false })
  photoPolicyLink: string;

  @Column({ select: false })
  codeOfConductLink: string;

  constructor(event?: Partial<Event>) {
    super();

    Object.assign(this, event);
  }
}
