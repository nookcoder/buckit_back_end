import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'password',
    });
  }

  async validate(
    phoneNumber: string,
    password: string
  ): Promise<User | UnauthorizedException> {
    const user: User = await this.authService.validateUser(
      phoneNumber,
      password
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
