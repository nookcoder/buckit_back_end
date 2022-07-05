import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, JwtModule, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
