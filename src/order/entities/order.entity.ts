import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsEnum } from 'class-validator';
import { Project } from '../../project/entities/project.entity';

enum OrderStatus {
  // 입금 대기
  DepositWaiting = 'depositWaiting',
  // 추가 입금 대기 -> 입금한 금액이 부족할 때 (보류)
  AdditionalDepositWaiting = 'additionalDepositWaiting',
  // 입금 완료
  DepositCompleted = 'depositCompleted',
  // 결재 완료
  PaymentCompleted = 'paymentCompleted',
}

// todo : 3시간 내에 입금됐는 지 확인하기
@Entity()
export class Order extends CoreEntity {
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @RelationId((order: Order) => order.user)
  userId: number;

  @ManyToOne(() => Project, (project) => project.orders)
  project: Project;

  @RelationId((order: Order) => order.project)
  projectId: number;

  @Column({ type: 'enum', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
