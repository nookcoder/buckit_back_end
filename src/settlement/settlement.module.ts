import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { ProjectModule } from '../project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialStatement } from '../project/entities/financial-statements.entity';

@Module({
  imports: [ProjectModule, TypeOrmModule.forFeature([FinancialStatement])],
  controllers: [SettlementController],
  providers: [SettlementService],
})
export class SettlementModule {}
