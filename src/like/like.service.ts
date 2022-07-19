import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeInput } from './dto/input-like.dto';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { CoreOutput } from '../common/dto/core-output.dto';

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

  async handleLike(input: LikeInput) {
    const likes = await this.likeRepository.find({
      where: {
        projectId: input.projectId,
      },
    });

    // 프로젝트에 좋아요가 하나도 없을 때
    if (!likes) {
      await this.createLike(input);
      return {
        ok: true,
      };
    }

    // 프로젝트가 좋아요를 가지고 있고 해당 유저를 가지고 있지 않을 때
    const isExist = likes.find((like) => like.userId == input.userId);
    if (!isExist) {
      await this.createLike(input);
      return {
        ok: true,
      };
    }

    await this.deleteLike(input);
  }

  async createLike(input: LikeInput) {
    const project = await this.projectRepository.findOne({
      where: { id: input.projectId },
      relations: ['likes'],
    });

    const user = await this.userRepository.findOne({
      where: { id: input.userId },
      relations: ['likes'],
    });

    const like = await this.likeRepository.create(input);
    user.likes.push(like);
    project.likes.push(like);

    await this.userRepository.save(user);
    await this.projectRepository.save(project);
    await this.likeRepository.save(like);
  }

  async deleteLike(input: LikeInput): Promise<CoreOutput> {
    try {
      await this.likeRepository.delete({
        userId: input.userId,
        projectId: input.projectId,
      });

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
