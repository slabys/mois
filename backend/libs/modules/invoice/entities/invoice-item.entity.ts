import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice.entity";

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ unsigned: true })
  price: number;

  @Column()
  amount: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items)
  invoice: Invoice;

  constructor(data?: Partial<InvoiceItem>) {
    Object.assign(this, data);
  }
}
