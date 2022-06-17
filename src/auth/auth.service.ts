import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userService.findOneByPhoneNumber(phoneNumber);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
