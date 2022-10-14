import { Body, Controller, Post } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFinancialStatementInput } from './dto/create-financial-statement.dto';

@Controller('api/v1/settlement')
@ApiTags('정산 관련 API')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  // todo : Role = admin 추가
  @Post('/financial-statement')
  @ApiCreatedResponse()
  @ApiOperation({
    summary: '정산 정보 입력 API',
    description: '그 달에 총 수익, 총 배당 금액 등 입력',
  })
  async createFinancialStatement(@Body() input: CreateFinancialStatementInput) {
    return await this.settlementService.createFinancialStatement(input);
  }
}
