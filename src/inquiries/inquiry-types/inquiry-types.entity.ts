import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Inquiry } from '../inquiries.entity';

/**
 * 問い合わせタイプ
 */
@Entity()
export class InquiryType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  type!: string;

  @Column()
  sortOrder!: number;

  /**
   * タイプは複数の問い合わせを持つ
   */
  @OneToMany(type => Inquiry, inquiry => inquiry.inquiryType)
  inquiries!: Inquiry[];
}
