import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDetail } from './entity/notification-detail.entity';
import { Notification } from './entity/notification.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationDetail, User])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
