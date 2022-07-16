import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDetail {
  @IsNumber()
  @ApiProperty()
  qty: number;

  @IsNumber()
  @ApiProperty()
  total: number;

  @ApiProperty()
  @IsNumber()
  pricePerQuarter: number;
}
