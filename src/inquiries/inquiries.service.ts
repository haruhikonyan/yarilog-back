import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Inquiry } from './inquiries.entity';
import { SaveInquiryDto } from './save-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryRepository.find({ relations: ['inquiryType'] });
  }

  async findById(id: number | string): Promise<Inquiry | undefined> {
    return this.inquiryRepository.findOne(id);
  }

  async create(inquiryData: SaveInquiryDto): Promise<Inquiry> {
    const inquiryType = await this.inquiryRepository.create(inquiryData);
    return await this.inquiryRepository.save(inquiryType);
  }

  async update(id: number, inquiryData: SaveInquiryDto): Promise<Inquiry> {
    const inquiryType = await this.findById(id);
    // 存在しなければエラーを返す
    if (inquiryType == null) {
      throw new NotFoundException();
    }
    await this.inquiryRepository.merge(inquiryType, inquiryData);
    return await this.inquiryRepository.save(inquiryType);
  }
}
