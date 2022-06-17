import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginInput } from './dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginInput: LoginInput) {
    return 'hello world';
  }
}
