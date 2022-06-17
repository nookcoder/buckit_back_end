import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Like])],
})
export class LikeModule {}
