import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CheckPhone extends PickType(User, ['phoneNumber']) {}

export class CheckEmail extends PickType(User, ['email']) {}
