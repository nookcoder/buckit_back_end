import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { CoreOutput } from '../common/dto/core-output.dto';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCustomRepository: UserRepository
  ) {}

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
      const user = await this.userCustomRepository.findOneByPhoneNumber(
        phoneNumber
      );
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

    const user = await this.userCustomRepository.findOneByEmail(email);
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

  async getProfileById(userId: number): Promise<User | NotFoundException> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        return user;
      }
      return new NotFoundException();
    } catch (e) {
      console.log(e);
      return new InternalServerErrorException();
    }
  }

  async createUser(
    createUserInput: CreateUserInput
  ): Promise<void | CoreOutput> {
    try {
      await this.userRepository.save(
        await this.userRepository.create(createUserInput)
      );
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

  async getAllUser(): Promise<
    User[] | undefined | InternalServerErrorException
  > {
    try {
      const users = await this.userRepository.find({ order: { id: 'ASC' } });
      return users;
    } catch (e) {
      console.log(e);
      return new InternalServerErrorException();
    }
  }
}
