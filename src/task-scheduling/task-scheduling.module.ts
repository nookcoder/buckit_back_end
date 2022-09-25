import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSchedulingService } from './task-scheduling.service';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  providers: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
