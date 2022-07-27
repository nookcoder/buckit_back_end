import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class NotificationDetail extends CoreEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  projectId: number;

  @Column({ nullable: true })
  url: string;

  @OneToMany((type) => Notification, (notification) => notification.detail)
  notifications: Notification[];
}
