import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLikeInput } from './create-like.dto';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createLike(input: CreateLikeInput) {
    const project = await this.projectRepository.findOne({
      where: { id: +input.projectId },
      relations: ['likes'],
    });
    const user = await this.userRepository.findOne({
      where: { id: +input.userId },
      relations: ['likes'],
    });

    const like = await this.likeRepository.create(input);
    user.likes.push(like);
    project.likes.push(like);

    await this.userRepository.save(user);
    await this.projectRepository.save(project);
    await this.likeRepository.save(like);
  }
}
