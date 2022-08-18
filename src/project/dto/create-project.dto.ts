import { Injectable } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project, ProjectStatus } from '../entities/project.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../entities/category.entity';

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
  'uuid',
]) {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  summary: string;

  @IsArray()
  @ApiProperty()
  content: string[];

  @IsString()
  @ApiProperty()
  address: string;

  @IsOptional()
  @ApiProperty()
  thumbnailImage: string;

  @IsString({
    message: 'Format of Deadline must be YYYY-MM-DD HH:MM:SS',
  })
  @ApiProperty()
  deadline: Date;

  @IsEnum(ProjectStatus, {
    message: "status must be 'before' or 'progress' or 'end'",
  })
  @ApiProperty()
  status: ProjectStatus;

  @IsNumber()
  @ApiProperty()
  total: number;

  @IsNumber()
  @ApiProperty()
  pricePerQuarter: number;

  @IsString()
  @ApiProperty()
  category: Category;
}

export class CreateProjectOutput extends CoreOutput {}
