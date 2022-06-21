import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './passport/local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt/jwt.strategy';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtModule,
    JwtStrategy,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
