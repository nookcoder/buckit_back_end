import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationCategories,
} from './entity/notification.entity';
import { NotificationDetail } from './entity/notification-detail.entity';
import { User } from '../user/entities/user.entity';
import { CreateNotificationInput } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationDetail)
    private readonly notificationDetailRepository: Repository<NotificationDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createNotification(input: CreateNotificationInput) {
    const notificationDetail = await this.getOrCreateNotificationDetail(
      input.title,
      input.projectId,
      input.url
    );

    if (input.allUsers) {
      const users: User[] = await this.userRepository.find();
      for (const user of users) {
        await this.saveNotification(
          user.id,
          input.category,
          notificationDetail
        );
      }
      return;
    }

    for (const phoneNumber of input.users) {
      const user = await this.userRepository.findOne({
        where: { phoneNumber: phoneNumber },
      });

      await this.saveNotification(user.id, input.category, notificationDetail);
    }

    return;
  }

  async saveNotification(
    userId: number,
    category: NotificationCategories,
    notificationDetail: NotificationDetail
  ) {
    const notification = await this.notificationRepository.create({
      userId: userId,
      category: category,
    });
    notification.detail = notificationDetail;

    await this.notificationRepository.save(notification);
  }

  async getOrCreateNotificationDetail(
    title: string,
    projectId: number | null,
    url: string | null
  ): Promise<NotificationDetail> {
    const notificationDetail = await this.notificationDetailRepository.findOne({
      where: { title: title },
    });

    if (!notificationDetail) {
      return await this.notificationDetailRepository.save(
        this.notificationDetailRepository.create({
          title: title,
          projectId: projectId ? projectId : null,
          url: url ? url : null,
        })
      );
    }

    return notificationDetail;
  }
}
