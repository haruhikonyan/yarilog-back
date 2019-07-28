import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Composer } from '../composers/composers.entity';

/**
 * 作曲家に紐づく国
 */
@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column('text')
  description: string;

  /**
   * 国は複数の作曲家を持つ
   */
  @ManyToMany(type => Composer, composer => composer.countries)
  composers: Composer[];
}