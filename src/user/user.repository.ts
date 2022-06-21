import { getConnection, Repository } from 'typeorm';
import { User } from './entities/user.entity';

export class UserRepository extends Repository<User> {
  async findOneByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOne({
      where: { phoneNumber },
      select: ['password', 'phoneNumber', 'id'],
    });
    return user;
  }
}
