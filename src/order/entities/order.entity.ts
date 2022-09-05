import { CoreEntity } from '../../common/entities/core.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

/**
 * 결제 전
 * 결제 완료
 * 승인 완료
 */
export enum OrderStatusType {
  PENDING,
  APPROVAL,
}

@Entity()
export class Orders extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @RelationId((self: Orders) => self.user)
  user_id: number;

  @ManyToOne((type) => Project, (project) => project.orders, {
    onDelete: 'CASCADE',
  })
  project: number;

  @RelationId((self: Orders) => self.project)
  project_id: number;

  @Column()
  order_code: string;

  // 한 블럭당 가격
  @Column()
  quarter_price: number;

  // 주문한 총 블럭 수
  @Column()
  quarter_qty: number;

  @Column()
  total_price: number;

  // 주문 상태
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.PENDING,
  })
  order_status: OrderStatusType;

  @BeforeInsert()
  calculateTotalPrice() {
    this.total_price = this.quarter_qty * this.quarter_price;
  }
}
