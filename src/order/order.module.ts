import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Order } from './entities/order.entity';
import { Like } from '../like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Order, Like])],
})
export class OrderModule {}
