import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CoreOutput } from '../common/dto/core-output.dto';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { CreateUserInput } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('api/v1/auth')
@ApiTags('인증 관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Access Token, Refresh Token 발급
   * @param req
   * @param res
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    return await this.authService.login(req, res);
  }

  @Post('/sign-up')
  async signUp(
    @Body() createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.authService.signUp(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/check/password')
  async checkOriginPassword(@Request() req, @Body('password') password) {
    const { userId } = req.user;
    return await this.authService.checkOriginPassword(userId, password);
  }

  /**
   * Access token, Refresh Token 재발급
   * @param req
   */
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refresh(@Request() req) {
    return await this.authService.refreshTokens(req);
  }

  /**
   * Refresh token null 처리
   * @param req
   */
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/logout')
  async logout(@Request() req): Promise<NotFoundException | CoreOutput> {
    const { userId } = req.user;
    return await this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  async isMatchWithRegisteredUser(@Query() query, @Request() req) {
    const { userId } = req.user;
    const { email, phoneNumber } = query;
    return await this.authService.isMatchWithRegisteredUser(
      email,
      phoneNumber,
      userId
    );
  }
}
