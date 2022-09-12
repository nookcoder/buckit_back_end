import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Like } from '../like/entities/like.entity';
import { ProjectService } from './project.service';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entities/category.entity';
import { Orders } from '../order/entities/order.entity';
import { ProjectEventsService } from './events/project-events.service';
import { FinancialStatement } from './entities/financial-statements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Like,
      Category,
      Orders,
      FinancialStatement,
    ]),
  ],
  providers: [ProjectService, CategoryRepository, ProjectEventsService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
