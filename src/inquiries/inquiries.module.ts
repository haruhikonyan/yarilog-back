import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { InquiryTypesController } from './inquiry-types/inquiry-types.controller';
import { InquiryTypesService } from './inquiry-types/inquiry-types.service';

@Module({
  providers: [InquiriesService, InquiryTypesService],
  controllers: [InquiriesController, InquiryTypesController]
})
export class InquiriesModule {}
