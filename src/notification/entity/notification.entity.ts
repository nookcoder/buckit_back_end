import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { NotificationCategory } from './notification-category.entity';

enum NotificationStatus {
  NOT_READ,
  READ,
}

@Entity()
export class Notification extends CoreEntity {
  // 알림을 받을 사용자
  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.NOT_READ,
  })
  notificationStatus: NotificationStatus;

  @ManyToOne(
    (type) => NotificationCategory,
    (category) => category.notifications
  )
  category: NotificationCategory;
}
