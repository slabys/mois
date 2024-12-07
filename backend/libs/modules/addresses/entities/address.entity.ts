import {
  Column,
  type DeepPartial,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

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

  constructor(data: DeepPartial<Address>) {
    Object.assign(this, data);
  }

  /**
   * Make copy of current entity
   * @returns 
   */
  copy() {
    return new Address({ ...this, id: undefined });
  }
}
