import { PickType } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class LoginInput extends PickType(User, ['phoneNumber', 'password']) {}
