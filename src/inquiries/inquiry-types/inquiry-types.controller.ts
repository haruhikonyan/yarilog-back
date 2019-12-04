import { Controller, Get, Query } from '@nestjs/common';
import { InquiryTypesService } from './inquiry-types.service';
import { InquiryType } from './inquiry-types.entity';

@Controller('inquiry-types')
export class InquiryTypesController {
  constructor(private readonly inquiryTypesService: InquiryTypesService) {}
  @Get()
  async findAll(): Promise<InquiryType[]> {
    return this.inquiryTypesService.findAll();
  }
}
