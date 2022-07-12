import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('api/v1/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:projectId')
  async createLike(@Request() req, @Param('projectId') projectId) {
    return await this.likeService.createLike({
      userId: req.user.userId,
      projectId: projectId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:projectId')
  async deleteLike(@Request() req, @Param('projectId') projectId) {
    return await this.likeService.deleteLike({
      userId: req.user.userId,
      projectId: projectId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:projectId')
  async handle(@Request() req, @Param('projectId') projectId) {
    return await this.likeService.handleLike({
      userId: req.user.userId,
      projectId: projectId,
    });
  }
}
