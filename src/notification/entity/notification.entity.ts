import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { NotificationDetail } from './notification-detail.entity';

enum NotificationStatus {
  NOT_READ,
  READ,
}

export enum NotificationCategories {
  NOTICE,
  EVENT,
  PROJECT,
  USER_PAYMENT,
  USER_PROFIT,
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

  @Column({ type: 'enum', enum: NotificationCategories })
  category: NotificationCategories;

  @ManyToOne((type) => NotificationDetail, (detail) => detail.notifications)
  detail: NotificationDetail;
}
