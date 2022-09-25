import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

export class PaymentSuccessEvent {
  orderCode: string;
  user: User;
  project: Project;
  quarterQty: number;
}
