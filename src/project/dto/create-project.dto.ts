import { Injectable } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';

@Injectable()
export class CreateProjectInput extends PickType(Project, [
  'title',
  'summary',
  'content',
  'address',
  'thumbnailImage',
  'deadline',
  'status',
  'total',
  'pricePerQuarter',
]) {}

export class CreateProjectOutput extends CoreOutput {}
