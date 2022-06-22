import { CoreOutput } from '../../common/dto/core-output.dto';

export class CheckExistenceInput {
  phoneNumber?: string;
  email?: string;
}

export class CheckExistenceOutput extends CoreOutput {
  existence?: boolean;
  userId?: number;
}
