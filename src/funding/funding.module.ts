import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { Orders } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Orders])],
  controllers: [FundingController],
  providers: [FundingService],
})
export class FundingModule {}
