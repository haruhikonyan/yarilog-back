import { Controller, Request, Post, Body } from '@nestjs/common';
import { Inquiry } from './inquiries.entity';
import { User } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';
import { InquiriesService } from './inquiries.service';
import { SaveInquiryDto } from './save-inquiry.dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() inquiryData: SaveInquiryDto,
    @Request() req: any,
  ): Promise<Inquiry> {
    const me:
      | User
      | undefined = await this.authService.getMeByAuthorizationHeaderToken(
      req.headers['authorization'],
    );
    inquiryData.author = me ? me.id : 'guest';
    return this.inquiriesService.create(inquiryData);
  }
}
