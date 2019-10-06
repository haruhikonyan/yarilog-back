import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';

export enum ProviderType {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

@Entity()
@Index(['accountId', 'providerType'], { unique: true })
export class ExternalAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @Column()
  accountId!: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
  })
  providerType!: ProviderType;

  @OneToOne(type => User, user => user.externalAccount, { nullable: false })
  @JoinColumn()
  user!: User;
}
