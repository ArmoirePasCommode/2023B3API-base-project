import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  startDate!: Date;
  @Column()
  endDate!: Date;
  @Column()
  projectId!: string;
  @Column('uuid')
  userId!: string;
}