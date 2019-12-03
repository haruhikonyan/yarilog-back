import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PlayingLogsModule } from './playing-logs/playing-logs.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TermsModule } from './terms/terms.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    PlayingLogsModule,
    AuthModule,
    AdminModule,
    TermsModule,
    InquiriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
