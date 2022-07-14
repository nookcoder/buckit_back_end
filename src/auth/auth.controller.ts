import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
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
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req);
  }

  @Post('/sign-up')
  async signUp(
    @Body() createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.authService.signUp(createUserInput);
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
    console.log(`email : ${email} phoneNumber : ${phoneNumber}`);
    return await this.authService.isMatchWithRegisteredUser(
      email,
      phoneNumber,
      userId
    );
  }

  @Get('/okcert')
  async okCert() {
    const response = this.authService.okCert();
    response.subscribe((res) => {
      console.log(res);
    });
    return response;
  }
}
