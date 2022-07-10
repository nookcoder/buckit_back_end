import { PickType } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class CreateUserInput extends PickType(User, [
  'phoneNumber',
  'email',
  'password',
  'role',
]) {
  termsOfMarketing: string | boolean;
}
