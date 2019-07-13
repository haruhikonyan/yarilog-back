import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayingLog } from 'src/playing-logs/playing-logs.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 30,
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    unique: true,
  })
  mailAddress: string;

  @Column()
  password: string;

  @Column({length: 50})
  nickname: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @OneToMany(type => PlayingLog, playingLog => playingLog.user)
  playingLogs: PlayingLog[];
}