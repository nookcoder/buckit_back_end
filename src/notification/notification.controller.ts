import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/create-notification.dto';

@Controller('/api/v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * users : Array<유저전화번호>
   * @param input
   */
  @Post()
  async createNotification(@Body() input: CreateNotificationInput) {
    return await this.notificationService.createNotification(input);
  }
}
