import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  zip: string;

  @Column()
  street: string;

  /**
   * House number with entrace number
   * @example 123
   * @example 124/3
   */
  @Column()
  houseNumber: string;
}
