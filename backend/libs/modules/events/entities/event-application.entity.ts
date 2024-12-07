import { User } from "modules/users";
import {
  Column,
  CreateDateColumn,
  type DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { EventSpot } from "./event-spot.entity";
import { Event } from "./event.entity";
import { Address } from "modules/addresses";

@Unique(["user", "event"])
@Entity()
export class EventApplication {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Event, (event) => event.applications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  event: Event;

  /**
   * Spot, must be one of {@link event} spots
   */
  @ManyToOne(() => EventSpot, {
    nullable: true,
    onDelete: "SET NULL",
  })
  spotType: EventSpot | null;

  @Column({ type: "json", default: {}, select: false })
  additionalData: object;

  @Column()
  idCard: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  personalAddress: Address;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  invoiceAddress: Address;

  @CreateDateColumn()
  createdAt: Date;

  constructor(initial?: DeepPartial<EventApplication>) {
    Object.assign(this, initial);
  }
}
