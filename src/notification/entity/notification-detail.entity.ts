import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class NotificationDetail extends CoreEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  projectId: number;

  @Column({ nullable: true })
  url: string;
}
