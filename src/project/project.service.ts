import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dto/create-project.dto';
import { validateDeadlineStringFormat } from './utils/validate';
import { FORMAT_ERROR } from './utils/constants';
import { GetAllProjectsOutput, GetProjectOutput } from './dto/get-project.dto';
import {
  UpdateProjectInput,
  UpdateProjectOutput,
} from './dto/update-project.dto';
import {
  NotFoundEntity,
  ResponseAndPrintError,
} from '../common/utils/error-message';
import { CoreOutput } from '../common/dto/core-output.dto';
import { uploadContentImages, uploadThumbnailImage } from './utils/images';
import { v4 as uuidv4 } from 'uuid';
import { InputCreateProjectBody } from './dto/input-create-project-body.dto';
import { FilesTypeDto } from './dto/files-type.dto';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async getAllProjects(
    status: ProjectStatus | undefined,
    page: number | undefined,
    pageSize: number | undefined
  ): Promise<Project[] | GetAllProjectsOutput> {
    try {
      const projects: Project[] = await this.projectRepository.find({
        where: {
          status: status,
        },
        relations: ['likes'],
        order: { createdAt: 'DESC' },
        skip: page ? (page - 1) * 10 : null,
        take: pageSize ? pageSize : 10,
      });
      if (projects) {
        return {
          projects,
          ok: true,
        };
      }
      return {
        ok: true,
        error: 'The Projects are Empty',
      };
    } catch (e) {
      ResponseAndPrintError(e);
    }
  }

  async getProject(
    projectId: number,
    userId: number
  ): Promise<Project | GetProjectOutput> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['likes'],
      });
      if (!project) {
        NotFoundEntity();
      }
      const isExistLike = project.likes.find((like) => like.userId == userId);
      return {
        ok: true,
        project,
        isLike: !!isExistLike,
      };
    } catch (e) {
      ResponseAndPrintError(e);
    }
  }

  async createProject(
    files: FilesTypeDto,
    input: InputCreateProjectBody
  ): Promise<CreateProjectOutput> {
    try {
      const projectUuid = uuidv4();
      const thumbnailUrl = await uploadThumbnailImage(
        projectUuid,
        files.thumbnail[0]
      );
      const contentUrl = await uploadContentImages(projectUuid, files.content);
      const deadline: Date | typeof FORMAT_ERROR =
        this.createDateInstanceForDeadline(input.deadline);

      if (deadline === FORMAT_ERROR) {
        return {
          ok: false,
          error: 'Format of Deadline must be YYYY-MM-DD HH:MM:SS',
        };
      }
      input.deadline = deadline;

      const category = await this.categoryRepository.getOrCreateCategory(
        input.category
      );

      const newProject: CreateProjectInput = {
        ...input,
        category: category,
        total: +input.total,
        thumbnailImage: thumbnailUrl,
        pricePerQuarter: +input.pricePerQuarter,
        content: contentUrl,
      };
      await this.projectRepository.save(
        this.projectRepository.create(newProject)
      );

      return {
        ok: true,
      };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  async updateProject(
    projectId: number,
    input: UpdateProjectInput
  ): Promise<UpdateProjectOutput> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      if (!project) {
        NotFoundEntity();
      }

      // 마감일자 Request 타입 확인
      if (input.deadline) {
        const deadline: Date | typeof FORMAT_ERROR =
          this.createDateInstanceForDeadline(input.deadline);
        if (deadline === FORMAT_ERROR) {
          return {
            ok: false,
            error: 'Format of Deadline must be YYYY-MM-DD HH:MM:SS',
          };
        }

        input.deadline = deadline;
      }

      // 총 가격 및 한 쿼터 당 가격 변경 시 유효성 검사
      if (input.total || input.pricePerQuarter) {
        if (!(input.total && input.pricePerQuarter)) {
          return {
            ok: false,
            error:
              'if you want to change total or pricePerQuarter, you need both total and pricePerQuarter',
          };
        }
      }

      const updatedProject = {
        ...project,
        ...input,
      };
      await this.projectRepository.save(
        this.projectRepository.create(updatedProject)
      );
      return {
        ok: true,
      };
    } catch (e) {
      ResponseAndPrintError(e);
    }
  }

  async deleteProject(projectId: number): Promise<CoreOutput> {
    try {
      await this.projectRepository.delete(projectId);
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

  createDateInstanceForDeadline(deadLine: any): Date | typeof FORMAT_ERROR {
    if (validateDeadlineStringFormat(deadLine)) {
      return new Date(deadLine);
    }

    return FORMAT_ERROR;
  }
}
