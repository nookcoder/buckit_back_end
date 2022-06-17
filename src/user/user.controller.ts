import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CoreOutput } from '../common/dto/core-output.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { CheckEmail, CheckPhone } from './dto/check-exist-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
