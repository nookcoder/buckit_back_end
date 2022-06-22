import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async createProject(input: CreateProjectInput): Promise<CreateProjectOutput> {
    try {
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
