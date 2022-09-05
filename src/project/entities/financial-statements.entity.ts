import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Project } from './project.entity';

@Entity()
export class FinancialStatement extends CoreEntity {
  @Column()
  total_revenue: number;

  @Column()
  operating_profit: number;

  @Column({ nullable: true })
  net_income: number;

  @Column()
  total_dividend: number;

  @ManyToOne((type) => Project, (project) => project.financialStatements)
  project: Project;

  @RelationId((self: FinancialStatement) => self.project)
  project_id: number;
}
