import { Entity, ManyToOne, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { ProjectUser } from '../../project-users/entities/project-user.entity';
import { User } from '../../users/entities/user.entity';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  name!: string;
  @Column('uuid')
  referringEmployeeId!: string;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'referringEmployeeId' })
  referringEmployee: User;
  @ManyToMany(() => ProjectUser, (projectUser) => projectUser.projectId)
  projectUsers: ProjectUser[];
}