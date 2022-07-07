import {
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ) {}

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

  async getLikes(userId: number) {
    return this.likeRepository.find({
      where: { userId: userId },
      relations: ['project'],
    });
  }

  async updatePassword({
    password,
    id,
  }: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      console.log(user);
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
      return {
        ok: false,
        error: e,
      };
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
}
