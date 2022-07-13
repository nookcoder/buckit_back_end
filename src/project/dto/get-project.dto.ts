import { CoreOutput } from '../../common/dto/core-output.dto';
import { Project } from '../entities/project.entity';

export class GetAllProjectsOutput extends CoreOutput {
  projects?: Project[];
}

export class GetProjectOutput extends CoreOutput {
  project?: Project;
  isLike?: boolean;
}
