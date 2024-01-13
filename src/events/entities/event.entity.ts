import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'date' })
  date!: Date;
  @Column({
    type: 'enum',
    enum: [ 'Accepted','Declined','Pending' ],
    default: 'Pending'})
  eventStatus?: 'Accepted'|'Declined'|'Pending';
  @Column({ type: 'enum', enum: ['RemoteWork', 'PaidLeave'] })
  eventType!: 'RemoteWork' | 'PaidLeave';
  @Column({ type: 'text', nullable: true })
  eventDescription?: string;
  @Column()
  userId!: string;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
