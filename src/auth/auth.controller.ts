import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { LoginInput } from './dto/login.dto';

@Controller('api/v1/auth')
@ApiTags('인증 관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }
}
