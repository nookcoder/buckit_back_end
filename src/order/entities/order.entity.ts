import { CoreEntity } from '../../common/entities/core.entity';
import { Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

export enum OrderStatus {}

export class Order extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.orders)
  userId: number;

  @ManyToOne((type) => Project, (project) => project.orders)
  projectId: number;

  @Column()
  quarter_price: number;

  @Column()
  quarter_qty: number;

  @Column()
  order_status: String;
}
