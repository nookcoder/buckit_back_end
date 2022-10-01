import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User, UserRole } from './entities/user.entity';
import { CheckExistenceOutput } from './dto/check-exist-user.dto';
import {
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dto/update-password.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { UserCheckQuery } from '../auth/dto/user-check-query.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User API')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /** GET **/
  @Get()
  @Roles(UserRole.Admin)
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

  @UseGuards(JwtAuthGuard)
  @Get('/likes')
  async getLikes(@Request() req, @Query() query) {
    const { userId } = req.user;
    const { page, pageSize } = query;
    return await this.userService.getLikes(userId, page, pageSize);
  }

  /**
   * 해당 정보의 유저가 존재하는 지 확인
   * 있으면 return true, 없으면 return false,
   * @Query key : phoneNumber, email
   */
  @ApiOkResponse({
    type: CheckExistenceOutput,
    description: '휴대폰 번호, 이메일 통해 DB 에 있는지 조회',
  })
  @Get('/check')
  async checkDuplicate(
    @Query() query: UserCheckQuery
  ): Promise<CheckExistenceOutput> {
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

  /**
   * Update Password
   * @param input : UpdatePasswordInput
   */
  @Post('/update-password')
  @ApiBody({ type: UpdatePasswordInput })
  async updatePassword(
    @Body() input: UpdatePasswordInput
  ): Promise<UpdatePasswordOutput> {
    return await this.userService.updatePassword({
      password: input.password,
      phoneNumber: input.phoneNumber,
    });
  }

  /**
   *
   * @param req
   * @param password
   */
  @UseGuards(JwtAuthGuard)
  @Post('/update-password/token')
  @ApiBody({ type: String })
  async updatePasswordWithAccessToken(
    @Request() req,
    @Body('password') password
  ) {
    const { userId } = req.user;
    return await this.userService.updatePasswordWithAccessToken(
      userId,
      password
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-fcm')
  async updateFCMToken(@Request() req) {
    const { userId } = req.user;
    const { fcm } = req.headers;
    return await this.userService.updateFcmToken(userId, fcm);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  async deleteUser(@Request() req) {
    const { userId } = req.user;
    return this.userService.deleteUser(userId);
  }
}
