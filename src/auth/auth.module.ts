import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtModule,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
