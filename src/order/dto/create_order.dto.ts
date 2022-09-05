import { PickType } from '@nestjs/swagger';
import { Orders } from '../entities/order.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';

export class CreateOrderInput extends PickType(Orders, [
  'project_id',
  'quarter_qty',
]) {}

export class CreateOrderOutput extends CoreOutput {
  order_code?: string;
}
