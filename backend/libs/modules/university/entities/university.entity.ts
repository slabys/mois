import { Photo } from "modules/photo";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class University {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Photo, { eager: true })
  photo: Photo | null;

  @CreateDateColumn()
  createdAt: Date;
}
