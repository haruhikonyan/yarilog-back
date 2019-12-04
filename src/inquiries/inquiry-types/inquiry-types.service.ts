import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { InquiryType } from './inquiry-types.entity';

@Injectable()
export class InquiryTypesService {
  constructor(
    @InjectRepository(InquiryType)
    private readonly inquiryTypeRepository: Repository<InquiryType>,
  ) {}

  async findAll(): Promise<InquiryType[]> {
    return this.inquiryTypeRepository.find();
  }

  async findById(id: number | string): Promise<InquiryType | undefined> {
    return this.inquiryTypeRepository.findOne(id);
  }

  // async create(inquiryTypeData: SaveInquiryTypeDto): Promise<InquiryType> {
  //   const inquiryType = await this.inquiryTypeRepository.create(inquiryTypeData);
  //   return await this.inquiryTypeRepository.save(inquiryType);
  // }
  //
  // async update(id: number, inquiryTypeData: SaveInquiryTypeDto): Promise<InquiryType> {
  //   const inquiryType = await this.findById(id);
  //   // 存在しなければエラーを返す
  //   if (inquiryType == null) {
  //     throw new NotFoundException();
  //   }
  //   await this.inquiryTypeRepository.merge(inquiryType, inquiryTypeData);
  //   return await this.inquiryTypeRepository.save(inquiryType);
  // }
}
