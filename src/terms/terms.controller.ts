import { Controller, Get } from '@nestjs/common';
import { TermsService } from './terms.service';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('latest-id')
  async latestId(): Promise<number> {
    const terms = await this.termsService.getLatest();
    return terms.id;
  }

  @Get('latest-tos')
  async latestTos(): Promise<string> {
    const terms = await this.termsService.getLatest();
    return terms.tos;
  }

  @Get('latest-privacy-policy')
  async latestPrivacyPolicy(): Promise<string> {
    const terms = await this.termsService.getLatest();
    return terms.privacyPolicy;
  }
}
