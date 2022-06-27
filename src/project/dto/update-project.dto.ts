import { PartialType } from '@nestjs/swagger';
import { CreateProjectInput } from './create-project.dto';
import { CoreOutput } from '../../common/dto/core-output.dto';

export class UpdateProjectInput extends PartialType(CreateProjectInput) {}

export class UpdateProjectOutput extends CoreOutput {}
