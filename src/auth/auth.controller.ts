import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CoreOutput } from '../common/dto/core-output.dto';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { CreateUserInput } from './dto/create-user.dto';

@Controller('api/v1/auth')
@ApiTags('인증 관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req);
  }

  @Post('/sing-up')
  async signUp(
    @Body() createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.authService.signUp(createUserInput);
  }

  // access token 이 만료되었을 때 refresh token 을 통해 at, rt 재발급
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refresh(@Request() req) {
    return await this.authService.refreshTokens(req);
  }

  // refresh token 으로 요청을 보내고 refresh token 삭제
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/logout')
  async logout(@Request() req): Promise<NotFoundException | CoreOutput> {
    const { userId } = req.user;
    return await this.authService.logout(userId);
  }
}
