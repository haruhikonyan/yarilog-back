import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { PlayingLog } from '../playing-logs/playing-logs.entity';
import { ExternalAccount } from '../auth/extarnal-accounts/extarnal-accounts.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    select: false,
    nullable: true,
  })
  username: string | null = null;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    select: false,
    nullable: true,
  })
  mailAddress: string | null = null;

  @Column({ type: 'varchar', select: false, nullable: true })
  password: string | null = null;

  @Column({ length: 50 })
  nickname!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null = null;

  // 同意した規約の id
  @Column({ default: 0 })
  consentTermsId!: number;

  // 最終ログイン時間
  @Column({ type: 'datetime', nullable: true })
  latestLoginAt!: Date;

  @OneToMany(type => PlayingLog, playingLog => playingLog.user)
  playingLogs!: PlayingLog[];

  @OneToOne(type => ExternalAccount, externalAccount => externalAccount.user)
  externalAccount!: ExternalAccount;
}
