import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

/**
 * 결제 전
 * 결제 완료
 * 승인 완료
 */
export enum OrderStatus {
  PENDING,
  Approval,
}

export class Order extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.orders)
  user_id: number;

  @ManyToOne((type) => Project, (project) => project.orders)
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
  @Column()
  order_status: String;

  @BeforeInsert()
  calculateTotalPrice() {
    this.total_price = this.quarter_qty * this.quarter_price;
  }
}
