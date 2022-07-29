import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/create-notification.dto';

@Controller('/api/v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() input: CreateNotificationInput) {
    return await this.notificationService.createNotification(input);
  }
}
