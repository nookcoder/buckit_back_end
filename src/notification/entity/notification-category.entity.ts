import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Notification } from './notification.entity';

enum NotificationCategories {
  NOTICE,
  EVENT,
  PROJECT,
  USER_PAYMENT,
  USER_PROFIT,
}

@Entity()
export class NotificationCategory extends CoreEntity {
  @Column({ type: 'enum', enum: NotificationCategories })
  category: NotificationCategories;

  @OneToMany((type) => Notification, (notification) => notification.category)
  notifications: Notification[];
}
