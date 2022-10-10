import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

export enum OrderStatusType {
  PENDING, // 결재 전
  APPROVAL, // 결재 완료
}

@Entity()
export class Orders extends CoreEntity {
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

  @Column()
  buyer_bank: string;

  @Column()
  buyer_name: string;

  // 주문 상태
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.PENDING,
  })
  order_status: OrderStatusType;

  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @RelationId((self: Orders) => self.user)
  user_id: number;

  @ManyToOne((type) => Project, (project) => project.orders, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @RelationId((self: Orders) => self.project)
  project_id: number;

  @BeforeInsert()
  calculateTotalPrice() {
    this.total_price = Math.round(
      this.quarter_qty * this.quarter_price * 1.033
    );
  }
}
