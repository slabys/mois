import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { InvoiceItem } from "./invoice-item.entity";
import { PaymentSubject } from "modules/payments";
import { InvoiceCurrency } from "../enums";

@Entity()
export class Invoice {
  // E<rok><číslo faktury v pořadí>
  @PrimaryColumn()
  id: string;

  @Column()
  iban: string;

  @Column()
  swift: string;

  // Event ID
  @Column()
  variableSymbol: number;

  // TODO: Change constantSymbol
  // User ID
  @Column()
  constantSymbol: number;

  @Column({ type: "enum", enum: InvoiceCurrency, default: InvoiceCurrency.CZK })
  currency: InvoiceCurrency;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true,
    eager: true,
  })
  items: InvoiceItem[];

  @ManyToOne(() => PaymentSubject, { eager: true, cascade: true })
  supplier: PaymentSubject;

  @ManyToOne(() => PaymentSubject, { eager: true, cascade: true })
  subscriber: PaymentSubject;

  @CreateDateColumn()
  createdAt: Date;

  constructor(data?: Partial<Invoice>) {
    Object.assign(this, data);
  }
}
