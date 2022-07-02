import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/users.module';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    UserRepository,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '20s' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtModule, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
