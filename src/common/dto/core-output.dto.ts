import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CoreOutput {
  @ApiPropertyOptional()
  error?: string;
  @ApiProperty()
  ok: boolean;
}
