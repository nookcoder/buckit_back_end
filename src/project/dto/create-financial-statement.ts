import { CoreOutput } from '../../common/dto/core-output.dto';

export class CreateFinancialStatementInput {
  total_revenue: number;
  operating_profit?: number;
  net_income?: number;
  total_dividend: number;
  project_id: number;
}

export class CreateFinancialStatementOutput extends CoreOutput {
  statementCode?: string;
}
