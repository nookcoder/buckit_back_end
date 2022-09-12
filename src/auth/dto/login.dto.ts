import { PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.dto';

export class LoginInput extends PickType(CreateUserInput, [
  'phoneNumber',
  'password',
]) {}
