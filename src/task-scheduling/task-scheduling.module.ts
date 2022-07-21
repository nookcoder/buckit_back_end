import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { TaskSchedulingService } from './task-scheduling.service';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { OrderDetail } from '../order/entities/order-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Order, OrderDetail])],
  providers: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
