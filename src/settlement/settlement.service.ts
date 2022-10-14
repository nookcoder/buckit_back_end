import { Injectable, Logger } from '@nestjs/common';
import { CreateFinancialStatementInput } from './dto/create-financial-statement.dto';
import { ProjectFindService } from '../project/project-find.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DividendStatus,
  FinancialStatement,
} from '../project/entities/financial-statements.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettlementService {
  constructor(
    private readonly projectFindService: ProjectFindService,
    @InjectRepository(FinancialStatement)
    private readonly financialStatementRepository: Repository<FinancialStatement>
  ) {}
  private readonly logger = new Logger(SettlementService.name);

  // financialStatement 생성
  async createFinancialStatement(input: CreateFinancialStatementInput) {
    try {
      const project =
        await this.projectFindService.getAllOfInformationAboutProjectById(
          input.project_id
        );
      if (!project) {
        this.logger.error('Not Found Project project_id : ' + input.project_id);
        return {
          ok: false,
        };
      }

      const { project_id, ...objectOfInput } = input;
      const financialStatement = this.financialStatementRepository.create({
        ...objectOfInput,
        status: DividendStatus.BEFORE,
      });

      financialStatement.project = project;
      await this.financialStatementRepository.save(financialStatement);
      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  // financial-statement 수정
}
