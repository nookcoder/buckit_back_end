import { PickType } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

export class InputCreateProjectBody extends PickType(Project, [
  'title',
  'summary',
  'address',
  'deadline',
  'fundingOpenDate',
  'status',
]) {
  total: string;
  pricePerQuarter: string;
  category: string;
}
