import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayingLog } from 'src/playing-logs/playing-logs.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(type => PlayingLog, playingLog => playingLog.user)
  playingLogs: PlayingLog[];
}