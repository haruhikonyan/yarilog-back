import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { InquiryType } from './inquiry-types/inquiry-types.entity';

/**
 * 問い合わせ
 */
@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  content!: string;

  @Column()
  mailAddress!: string;
  @Column({ default: false })
  isVerified!: boolean;
  @Column({ nullable: false, default: 'guest' })
  author!: string;

  /**
   * 問い合わせは一つのタイプを持つ
   */
  @ManyToOne(type => InquiryType, inquiryType => inquiryType.inquiries, {
    nullable: false,
  })
  inquiryType!: InquiryType;
}
