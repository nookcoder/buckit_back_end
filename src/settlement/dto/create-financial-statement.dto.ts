import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateFinancialStatementInput {
  @ApiProperty()
  project_id: number;

  @ApiProperty({ description: '총 매출', type: Number })
  @IsNumber()
  total_revenue: number;

  @ApiProperty({ description: '영업 이익', type: Number, nullable: true })
  @IsOptional()
  operating_profit?: number;

  @ApiProperty({ description: '순 이익', type: Number, nullable: true })
  @IsOptional()
  net_income?: number;

  @ApiProperty({ description: '배당으로 쓸 총 액수', type: Number })
  @IsOptional()
  total_dividend: number;
}
