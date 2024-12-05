import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class PaymentSubject {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // Address
  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  houseNumber: string;

  @Column()
  region: string;

  @Column()
  street: string;

  @Column()
  zip: string;

  // Other data
  @Column({ nullable: true })
  cin: string | null;

  @Column({ nullable: true })
  vatId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
