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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CoreOutput } from '../common/dto/core-output.dto';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { CreateUserInput } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LoginInput } from './dto/login.dto';
import { UserCheckQuery } from './dto/user-check-query.dto';

@Controller('api/v1/auth')
@ApiTags('Auth API')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Access Token, Refresh Token 발급
   * @param req
   * @param res
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginInput })
  @ApiUnauthorizedResponse({ description: '휴대폰 번호, 비밀번호 불일치' })
  @ApiOkResponse({
    description: 'cookie 에 jwt, jwt-refresh 담아서 response',
  })
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    return await this.authService.login(req, res);
  }

  @ApiCreatedResponse({ description: '회원가입 성공' })
  @ApiBody({ type: CreateUserInput })
  @Post('/sign-up')
  async signUp(
    @Body('body') createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.authService.signUp(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bear 인증 방식 / Access Token',
  })
  @Post('/check/password')
  async checkOriginPassword(@Request() req, @Body('password') password) {
    const { userId } = req.user;
    return await this.authService.checkOriginPassword(userId, password);
  }

  /**
   * Access token, Refresh Token 재발급
   * @param req
   * @param res
   */
  @UseGuards(JwtRefreshAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bear 인증 방식 / Refresh Token',
  })
  @Get('/refresh')
  async refresh(@Request() req, @Res({ passthrough: true }) res) {
    return await this.authService.refreshTokens(req, res);
  }

  /**
   * Refresh token null 처리
   * @param req
   */
  @UseGuards(JwtRefreshAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bear 인증 방식 / Access Token',
  })
  @Get('/logout')
  async logout(@Request() req): Promise<NotFoundException | CoreOutput> {
    const { userId } = req.user;
    return await this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bear 인증 방식 / Access Token',
  })
  @Get('/check')
  async isMatchWithRegisteredUser(
    @Query() query: UserCheckQuery,
    @Request() req
  ) {
    const { userId } = req.user;
    const { email, phoneNumber } = query;
    return await this.authService.isMatchWithRegisteredUser(
      email,
      phoneNumber,
      userId
    );
  }

  @Get('/certification')
  async certificateByIMP(@Query() query) {
    const { imp_uid, merchant_uid, success } = query;
    return await this.authService.certificateByIMP(
      imp_uid,
      merchant_uid,
      success
    );
  }
}
