import { Injectable } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project, ProjectStatus } from '../entities/project.entity';
import { CoreOutput } from '../../common/dto/core-output.dto';
import { IsEnum, IsNumber, IsString } from 'class-validator';

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
]) {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  summary: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  thumbnailImage: string;

  @IsString()
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
}

export class CreateProjectOutput extends CoreOutput {}
