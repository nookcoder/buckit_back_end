import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Like } from '../like/entities/like.entity';
import { ProjectService } from './project.service';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entities/category.entity';
import { Orders } from '../order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Like, Category, Orders])],
  providers: [ProjectService, CategoryRepository],
  controllers: [ProjectController],
})
export class ProjectModule {}
