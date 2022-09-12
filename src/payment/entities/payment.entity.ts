import { Entity, OneToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Orders } from '../../order/entities/order.entity';

@Entity()
export class Payment extends CoreEntity {
  // @OneToOne((type) => Orders, (order) => order.payment, { onDelete: 'CASCADE' })
  // order: Orders;
}
