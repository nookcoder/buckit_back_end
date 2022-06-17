import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Order } from '../order/entities/order.entity';
import { Like } from '../like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Order, Like])],
  providers: [],
  controllers: [ProjectController],
})
export class ProjectModule {}
