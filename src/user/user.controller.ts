import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CoreOutput } from '../common/dto/core-output.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { CheckEmail, CheckPhone } from './dto/check-exist-user.dto';
import { JwtAuthGuard } from '../auth/passport/jwt/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(): Promise<
    User[] | undefined | InternalServerErrorException
  > {
    return await this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return await this.userService.getProfileById(req.user.userId);
  }

  // 존재하는 유저인지 확인
  @Post('/check')
  async checkUserPhoneNumber(
    @Body() input: CheckPhone | CheckEmail
  ): Promise<CoreOutput> {
    return await this.userService.findUserByPhoneNumberOrEmail(input);
  }

  @Post()
  async createNewUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.userService.createUser(createUserInput);
  }
}
