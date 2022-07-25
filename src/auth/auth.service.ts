import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from './dto/create-user.dto';
import { CoreOutput } from '../common/dto/core-output.dto';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: ['phoneNumber', 'password', 'id', 'role'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(req: any) {
    const { id, phoneNumber, role } = req.user;
    const { accessToken, refreshToken } = await this.getTokens(
      id,
      phoneNumber,
      role
    );
    await this.updateRefreshToken(id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signUp(createUserInput: CreateUserInput): Promise<void | CoreOutput> {
    const termsOfMarketing: boolean =
      createUserInput.termsOfMarketing == 'true';
    const newUser = {
      ...createUserInput,
      termsOfMarketing: termsOfMarketing,
      uuid: uuidv4(),
    };
    try {
      await this.userRepository.save(await this.userRepository.create(newUser));
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async checkOriginPassword(userId, password): Promise<CoreOutput> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['password'],
    });
    if (!user) {
      return {
        ok: false,
        error: 'Not Found This User',
      };
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        ok: true,
      };
    }

    return {
      ok: false,
    };
  }

  async refreshTokens(req: any) {
    const { userId, role, phoneNumber, refresh_token } = req.user;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['refreshToken'],
    });

    if (!user) {
      return new NotFoundException();
    }
    if (refresh_token !== user.refreshToken) {
      return new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.getTokens(
      userId,
      role,
      phoneNumber
    );
    await this.updateRefreshToken(userId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: number): Promise<NotFoundException | CoreOutput> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return new NotFoundException();
    }

    await this.userRepository.update(userId, {
      refreshToken: null,
    });

    return {
      ok: true,
    };
  }

  async isMatchWithRegisteredUser(
    email: string,
    phoneNumber: string,
    userId: number
  ) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (email && user.email === email) {
        return {
          ok: true,
        };
      } else if (phoneNumber && user.phoneNumber === phoneNumber) {
        return {
          ok: true,
        };
      }
      return {
        ok: false,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: e,
      };
    }
  }

  // todo : refresh token 암호화 bcrypt 는 72자까지 밖에 안되서 항상 true 를 반환한다.
  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async getTokens(userId: number, phoneNumber: string, userRole: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: userId,
          role: userRole,
        },
        {
          secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
          expiresIn: this.configService.get<string>('ACCESS_EXPIRES_IN'),
        }
      ),
      this.jwtService.signAsync(
        {
          userId: userId,
          phoneNumber: phoneNumber,
          role: userRole,
        },
        {
          secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
          expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
        }
      ),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
