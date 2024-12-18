import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Event } from "./event.entity";
import { InvoiceCurrency } from "modules/invoice/enums";

/**
 * TODO: multiple-currencies?
 */
@Entity()
export class EventSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unsigned: true })
  price: number;

  @ManyToOne(() => Event, (event) => event.spotTypes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  event: Event;


  @Column({ type: "enum", enum: InvoiceCurrency, default: InvoiceCurrency.CZK })
  currency: InvoiceCurrency;

  constructor(base?: Partial<EventSpot>) {
    Object.assign(this, base);
  }
}
