import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Orders } from './entities/order.entity';
import { FundingListener } from './listeners/funding.listener';
import { ShareModule } from '../share/share.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Orders]), ShareModule],
  controllers: [OrderController],
  providers: [OrderService, FundingListener],
  exports: [OrderService],
})
export class OrderModule {}
