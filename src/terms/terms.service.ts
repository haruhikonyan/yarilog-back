import { Injectable, NotFoundException } from '@nestjs/common';
import { Terms } from './terms.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveTermsDto } from './save-terms.dto';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Terms)
    private readonly termsRepository: Repository<Terms>,
  ) {}

  async findAll(): Promise<Terms[]> {
    return await this.termsRepository.find();
  }

  async findById(id: number | string): Promise<Terms | undefined> {
    return await this.termsRepository.findOne(id);
  }

  async getLatest(): Promise<Terms | undefined> {
    return await this.termsRepository.findOne({ order: { id: 'DESC' } });
  }

  async create(termsData: SaveTermsDto): Promise<Terms> {
    const terms = await this.termsRepository.create(termsData);
    return await this.termsRepository.save(terms);
  }

  async update(id: number, termsData: SaveTermsDto): Promise<Terms> {
    const terms = await this.findById(id);
    // 存在しなければエラーを返す
    if (terms == null) {
      throw new NotFoundException();
    }
    await this.termsRepository.merge(terms, termsData);
    return await this.termsRepository.save(terms);
  }
}
