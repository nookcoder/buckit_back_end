import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CheckExistenceInput,
  CheckExistenceOutput,
} from './dto/check-exist-user.dto';
import {
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dto/update-password.dto';
import { Like } from '../like/entities/like.entity';
import { ResponseAndPrintError } from '../common/utils/error-message';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async getAllUser(): Promise<
    User[] | undefined | InternalServerErrorException
  > {
    try {
      return await this.userRepository.find({ order: { id: 'ASC' } });
    } catch (e) {
      console.log(e);
      return new InternalServerErrorException();
    }
  }

  async getProfileById(userId: number): Promise<User | NotFoundException> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['likes'],
      });
      if (user) {
        return user;
      }
      return new NotFoundException();
    } catch (e) {
      console.log(e);
      return new InternalServerErrorException();
    }
  }

  async getLikes(userId: number, page: number, pageSize: number) {
    return await this.likeRepository.find({
      where: { userId: userId },
      relations: ['project', 'project.category'],
      order: { project: { createdAt: 'DESC' } },
      skip: page ? (page - 1) * 10 : 1,
      take: pageSize ? pageSize : 10,
    });
  }

  async updatePassword({
    password,
    phoneNumber,
  }: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });
      if (!user) {
        return {
          ok: false,
          error: 'Not Found this user',
        };
      }
      user.password = password;
      await this.userRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      ResponseAndPrintError(e);
    }
  }

  async updatePasswordWithAccessToken(userId: number, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return {
          ok: false,
          error: 'Not Found this.user',
        };
      }

      user.password = password;
      await this.userRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      ResponseAndPrintError(e);
    }
  }

  async checkExistence({
    phoneNumber,
    email,
  }: CheckExistenceInput): Promise<CheckExistenceOutput> {
    if (phoneNumber) {
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (user) {
        return {
          ok: true,
          existence: true,
          userId: user.id,
        };
      }
      return {
        ok: true,
        existence: false,
      };
    }

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id'],
    });
    if (user) {
      return {
        ok: true,
        existence: true,
        userId: user.id,
      };
    }
    return {
      ok: true,
      existence: false,
    };
  }

  async updateFcmToken(userId: number, fcmToken: string) {
    await this.userRepository.update(userId, {
      fcm: fcmToken,
    });
  }

  async deleteUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      await this.userRepository.delete(userId);
      this.logger.warn(`회원 탈퇴 ${user.phoneNumber} ${user.name}`);
      return {
        ok: true,
      };
    } catch (err) {
      this.logger.error(err);
      return {
        ok: false,
      };
    }
  }
}
