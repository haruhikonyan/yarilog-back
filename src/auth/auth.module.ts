import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: '30 days',
      },
    }),
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [PassportModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}