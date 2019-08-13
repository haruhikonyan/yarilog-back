import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PlayingLog } from '../playing-logs.entity';
import { Composer } from '../composers/composers.entity';

/**
 * 楽曲
 */
@Entity()
export class Tune {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @Column({ length: 50 })
  title!: string;

  @Column()
  author!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  /**
   * 楽曲には複数の演奏記録が紐づく
   */
  @OneToMany(type => PlayingLog, playingLog => playingLog.tune)
  playingLogs: PlayingLog[] = [];

  /**
   * 楽曲は一人の作曲家を持つ
   */
  @ManyToOne(type => Composer, composer => composer.tunes)
  composer!: Composer;
}