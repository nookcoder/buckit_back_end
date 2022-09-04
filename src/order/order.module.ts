import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Order])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
