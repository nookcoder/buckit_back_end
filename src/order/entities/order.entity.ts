import { CoreEntity } from '../../common/entities/core.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  BEFORE_PAYMENT,
  PENDING,
  APPROVAL,
}

@Entity()
export class Orders extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user_id: number;

  @ManyToOne((type) => Project, (project) => project.orders, {
    onDelete: 'CASCADE',
  })
  project_id: number;

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
    default: OrderStatusType.BEFORE_PAYMENT,
  })
  order_status: String;

  @BeforeInsert()
  calculateTotalPrice() {
    this.total_price = this.quarter_qty * this.quarter_price;
  }
}
