import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserCheckQuery {
  @ApiPropertyOptional({
    description: 'phoneNumber 과 email 모두 null 값이면 안됨',
  })
  email?: string;
  @ApiPropertyOptional()
  phoneNumber?: string;
}
