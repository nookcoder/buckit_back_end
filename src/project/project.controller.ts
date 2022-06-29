import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { CoreOutput } from '../common/dto/core-output.dto';
import { UpdateProjectInput } from './dto/update-project.dto';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('/api/v1/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(): Promise<Project[] | CoreOutput> {
    return await this.projectService.getAllProjects();
  }

  @Get('/:projectId')
  async getProject(@Param('projectId') id) {
    return await this.projectService.getProject(id);
  }

  /**
   * Create a new project
   * @param input
   */

  @Post()
  @Roles('admin')
  async createProject(
    @Body() input: CreateProjectInput
  ): Promise<CreateProjectOutput> {
    return await this.projectService.createProject(input);
  }

  /**
   * Project 정보 및 상태 업데이트
   * @param projectId
   * @param input
   */
  @Post('/:projectId')
  async updateProject(
    @Param('projectId') projectId,
    @Body() input: UpdateProjectInput
  ) {
    return await this.projectService.updateProject(projectId, input);
  }

  @Delete('/:projectId')
  async deleteProject(@Param('projectId') projectId) {
    return await this.projectService.deleteProject(projectId);
  }
}
