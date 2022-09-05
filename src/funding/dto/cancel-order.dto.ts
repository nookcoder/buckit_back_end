import { CoreOutput } from '../../common/dto/core-output.dto';

export class CancelOrderInput {
  order_code: string;
}

export class CancelOrderOutput extends CoreOutput {}
