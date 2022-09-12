import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project, ProjectStatus } from './entities/project.entity';
import { CoreOutput } from '../common/dto/core-output.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { UpdateProjectInput } from './dto/update-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InputCreateProjectBody } from './dto/input-create-project-body.dto';
import { OrderBy, UPLOAD_FIELDS } from './utils/constants';
import { FilesTypeDto } from './dto/files-type.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateFinancialStatementInput } from './dto/create-financial-statement';

@Controller('/api/v1/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(
    @Query('status') status: ProjectStatus | undefined,
    @Query('page') page: number | undefined,
    @Query('pageSize') pageSize: number | undefined,
    @Query('order') order: OrderBy | undefined
  ): Promise<Project[] | CoreOutput> {
    return await this.projectService.getAllProjects(
      status,
      page,
      pageSize,
      order
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:projectId')
  async getProject(@Param('projectId') id, @Request() req) {
    return await this.projectService.getProject(id, req.user.userId);
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

  @Post('/financial-statement')
  async createFinancialStatement(@Body() input: CreateFinancialStatementInput) {
    return await this.projectService.createFinancialStatements(input);
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
