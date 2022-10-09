import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { Orders } from '../entities/order.entity';

export class PaymentSuccessEvent {
  order: Orders;
  orderCode: string;
  user: User;
  project: Project;
  quarterQty: number;
}
