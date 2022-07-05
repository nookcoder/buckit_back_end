import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: ['phoneNumber', 'password', 'id', 'role'],
    });
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(req: any) {
    const payloads = { userId: req.user.id, role: req.user.role };
    return {
      access_token: this.jwtService.sign(payloads),
    };
  }
}
