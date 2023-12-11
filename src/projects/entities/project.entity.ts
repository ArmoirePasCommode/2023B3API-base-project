import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  name!: string;
  @Column('uuid')
  referringEmployeeId!: string;
}