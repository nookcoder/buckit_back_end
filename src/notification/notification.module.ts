import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationCategory } from './entity/notification-category.entity';
import { NotificationDetail } from './entity/notification-detail.entity';
import { Notification } from './entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationCategory,
      NotificationDetail,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
