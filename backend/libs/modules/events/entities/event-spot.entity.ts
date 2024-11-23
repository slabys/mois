import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Event } from "./event.entity";

@Entity()
export class EventSpot {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unsigned: true })
  price: number;

  @Column({ unsigned: true })
  capacity: number | null;

  @ManyToOne(() => Event, (event) => event.spotTypes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  event: Event;

  constructor(base?: Partial<EventSpot>) {
    Object.assign(this, base);
  }
}
