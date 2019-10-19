import { Module } from '@nestjs/common';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { Terms } from './terms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Terms])],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
