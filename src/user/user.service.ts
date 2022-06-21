import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { CoreOutput } from '../common/dto/core-output.dto';
import { CheckEmail, CheckPhone } from './dto/check-exist-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByPhoneNumberOrEmail(
    input: CheckPhone | CheckEmail
  ): Promise<CoreOutput> {
    const user = await this.userRepository.findOne({
      where: {
        ...input,
      },
    });

    // 중복되는 User 가 없을 때
    if (!user) {
      return {
        ok: true,
      };
    }
    // 중복되는 User 가 있을 때
    return {
      ok: false,
      error: 'This user is already existed',
    };
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: ['password', 'phoneNumber', 'id'],
    });
    return user;
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
      const newUser = await this.userRepository.save(
        await this.userRepository.create(createUserInput)
      );
      // todo : 삭제
      console.log(newUser);
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

  async getAllUser(): Promise<User[] | InternalServerErrorException> {
    try {
      const users = await this.userRepository.find({ order: { id: 'ASC' } });
      return users;
    } catch (e) {
      console.log(e);
      return new InternalServerErrorException();
    }
  }
}
