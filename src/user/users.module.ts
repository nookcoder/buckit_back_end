import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Like } from '../like/entities/like.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Order])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
