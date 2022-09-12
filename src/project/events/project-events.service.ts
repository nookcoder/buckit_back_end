import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProjectEventsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  // 1000 * 60 * 60 * 24 : 24시간
  // @Interval(1000 * 5)
  // async handleProjectStatus() {
  //   const now = moment(Date.now());
  //   const projects = await this.projectRepository.find();
  //   for (const project of projects) {
  //     if (moment(project.deadline).diff(now) <= 0) {
  //       project.status = ProjectStatus.FundingEnd;
  //       await this.projectRepository.save(project);
  //     } else if (moment(project.fundingOpenDate).diff(now) <= 0) {
  //       project.status = ProjectStatus.FundingPROGRESS;
  //       await this.projectRepository.save(project);
  //     }
  //   }
  // }
}
