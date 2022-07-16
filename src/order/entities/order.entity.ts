import { CoreEntity } from '../../common/entities/core.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsEnum } from 'class-validator';
import { Project } from '../../project/entities/project.entity';
import { OrderDetail } from './order-detail.entity';

export enum OrderStatus {
  // 입금 대기
  DepositWaiting,
  // 입금 완료
  DepositCompleted,
  // 결재 완료
  PaymentCompleted,
}

@Entity()
export class Order extends CoreEntity {
  // todo : API 달고 넣어야되나
  @Column({ unique: true, nullable: true })
  orderNumber: string;

  @Column('boolean', { default: false })
  expired: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @RelationId((order: Order) => order.user)
  userId: number;

  @ManyToOne(() => Project, (project) => project.orders)
  project: Project;

  @RelationId((order: Order) => order.project)
  projectId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.DepositWaiting,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @OneToOne((type) => OrderDetail, (orderDetail) => orderDetail.order)
  @Column('simple-json')
  orderDetail: OrderDetail;

  @BeforeInsert()
  async createOrderNumber() {
    this.orderNumber = Date.now().toString(16).toUpperCase();
  }
}
