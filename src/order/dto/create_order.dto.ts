import { PickType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';

export class CreateOrderInput extends PickType(Order, [
  'project_id',
  'quarter_qty',
]) {}

export class CreateOrderOutput extends CoreOutput {}
