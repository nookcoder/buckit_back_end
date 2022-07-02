import { PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUser extends PartialType(User) {}
