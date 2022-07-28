import { NotificationCategories } from '../entity/notification.entity';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationInput {
  @IsBoolean()
  allUsers: boolean;

  @IsString({ each: true, message: "users is array of user's phone number" })
  users: string[];

  @IsEnum(NotificationCategories, {
    message:
      'Category must be NOTICE(0) or EVENT(1) or PROJECT(2) or USER_PAYMENT(3) or USER_PROFIT(4)',
  })
  category: NotificationCategories;

  @IsString()
  title: string;

  @IsOptional()
  projectId?: number;

  @IsOptional()
  url?: string;
}
