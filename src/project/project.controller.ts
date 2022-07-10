import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CoreOutput } from '../common/dto/core-output.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { UpdateProjectInput } from './dto/update-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InputCreateProjectBody } from './dto/input-create-project-body.dto';
import { UPLOAD_FIELDS } from './utils/constants';
import { FilesTypeDto } from './dto/files-type.dto';

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
   * @param files
   * @param input
   */
  @Post('/')
  @UseInterceptors(FileFieldsInterceptor(UPLOAD_FIELDS))
  async createProject(
    @UploadedFiles()
    files: FilesTypeDto,
    @Body() input: InputCreateProjectBody
  ) {
    return await this.projectService.createProject(files, input);
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
  @Roles(UserRole.Admin)
  async deleteProject(@Param('projectId') projectId) {
    return await this.projectService.deleteProject(projectId);
  }
}
