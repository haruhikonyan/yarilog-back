import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { InquiryTypesController } from './inquiry-types/inquiry-types.controller';
import { InquiryTypesService } from './inquiry-types/inquiry-types.service';
import { Inquiry } from './inquiries.entity';
import { InquiryType } from './inquiry-types/inquiry-types.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, InquiryType]), AuthModule],
  providers: [InquiriesService, InquiryTypesService],
  controllers: [InquiriesController, InquiryTypesController],
})
export class InquiriesModule {}
