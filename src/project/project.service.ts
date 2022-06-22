import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dto/create-project.dto';
import { createDateInstanceForDeadline } from './utils/validate';
import { FORMAT_ERROR } from './utils/constants';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async createProject(input: CreateProjectInput): Promise<CreateProjectOutput> {
    try {
      const deadline: Date | typeof FORMAT_ERROR =
        createDateInstanceForDeadline(input.deadline);
      if (deadline === FORMAT_ERROR) {
        return {
          ok: false,
          error: 'Format of Deadline must be YYYY-MM-DD HH-MM-SS',
        };
      }
      input.deadline = deadline;
      const newProject = await this.projectRepository.create(input);
      await this.projectRepository.save(newProject);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
}
