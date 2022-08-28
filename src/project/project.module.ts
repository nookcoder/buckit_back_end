import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Like } from '../like/entities/like.entity';
import { ProjectService } from './project.service';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Like, Category])],
  providers: [ProjectService, CategoryRepository],
  controllers: [ProjectController],
})
export class ProjectModule {}
