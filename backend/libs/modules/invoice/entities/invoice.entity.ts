import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { InvoiceItem } from "./invoice-item.entity";
import { PaymentSubject } from "modules/payments";

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

  // User ID
  @Column()
  constantSymbol: number;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true,
    eager: true,
  })
  items: InvoiceItem[];

  @ManyToOne(() => PaymentSubject, { eager: true })
  supplier: PaymentSubject;

  @ManyToOne(() => PaymentSubject, { eager: true })
  subscriber: PaymentSubject;

  @CreateDateColumn()
  createdAt: Date;

  constructor(data?: Partial<Invoice>) {
    Object.assign(this, data);
  }
}
