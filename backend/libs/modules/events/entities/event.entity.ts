import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  // @ManyToOne(() => Organization, { nullable: false })
  // createdBy: Organization;

  @CreateDateColumn()
  createdAt: Date;

  constructor(event?: Partial<Event>) {
    super();
    Object.assign(this, event);
  }
}
