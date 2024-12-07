import { User } from "modules/users";
import {
  Column,
  CreateDateColumn,
  type DeepPartial,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { EventSpot } from "./event-spot.entity";
import { Event } from "./event.entity";

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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "json", default: {} })
  additionalData: object;

  constructor(initial?: DeepPartial<EventApplication>) {
    Object.assign(this, initial);
  }
}
