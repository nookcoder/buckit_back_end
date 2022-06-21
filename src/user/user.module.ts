import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Like } from '../like/entities/like.entity';
import { Order } from '../order/entities/order.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Order]), UserRepository],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
