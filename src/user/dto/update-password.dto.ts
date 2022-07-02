import { Injectable } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';

@Injectable()
export class UpdatePasswordInput extends PickType(User, ['password', 'id']) {}

export class UpdatePasswordOutput extends CoreOutput {}
