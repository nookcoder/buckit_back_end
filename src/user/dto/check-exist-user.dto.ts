import { CoreOutput } from '../../common/dto/core-output.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckExistenceInput {
  phoneNumber?: string;
  email?: string;
}

export class CheckExistenceOutput extends CoreOutput {
  @ApiPropertyOptional()
  existence?: boolean;
  @ApiPropertyOptional()
  userId?: number;
}
