import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CoreOutput } from '../common/dto/core-output.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/passport/jwt/jwt-auth.guard';
import { User } from './entities/user.entity';
import { CheckExistenceOutput } from './dto/check-exist-user.dto';
import {
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dto/update-password.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /** GET **/
  @Get()
  async getAllUser(): Promise<
    User[] | undefined | InternalServerErrorException
  > {
    return await this.userService.getAllUser();
  }

  /**
   * @Header Authorization : Bearer${access_token}
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getMyProfile(@Request() req) {
    return await this.userService.getProfileById(req.user.userId);
  }

  /**
   * 해당 정보의 유저가 존재하는 지 확인
   * 있으면 return true, 없으면 return false,
   * @Query key : phoneNumber, email
   */
  @Get('/check')
  async isExistedUser(@Query() query): Promise<CheckExistenceOutput> {
    const phoneNumber = query['phoneNumber'];
    const email = query['email'];
    if (!phoneNumber && !email) {
      return {
        ok: false,
        error: 'Both phone and email are empty',
      };
    }
    return this.userService.checkExistence({ phoneNumber, email });
  }

  /** POST **/
  @Post()
  async createNewUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    return await this.userService.createUser(createUserInput);
  }

  @Post('/:userId/password')
  async updatePassword(
    @Param('userId') id,
    @Body() input: UpdatePasswordInput
  ): Promise<UpdatePasswordOutput> {
    return await this.userService.updatePassword({
      password: input.password,
      id,
    });
  }
}
