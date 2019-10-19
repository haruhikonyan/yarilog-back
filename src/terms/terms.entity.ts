import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
/**
 * 規約類
 */
@Entity()
export class Terms {
  // id が新しい方がバージョンが新しい
  @PrimaryGeneratedColumn()
  id!: number;

  // 利用規約
  @Column({ type: 'text' })
  tos!: string;

  // プライバシーポリシー
  @Column({ type: 'text' })
  privacyPolicy!: string;
}
