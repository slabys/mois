import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class University {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn() 
  createdAt: Date;
}
