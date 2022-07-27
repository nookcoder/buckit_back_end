import { Module } from '@nestjs/common';
import { ProfitController } from './profit.controller';
import { ProfitService } from './profit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  controllers: [ProfitController],
  providers: [ProfitService],
})
export class ProfitModule {}
