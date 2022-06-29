import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/passport/jwt/jwt-auth.guard';

@Controller('api/v1/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:projectId')
  @UseGuards(JwtAuthGuard)
  async createLike(@Request() req, @Param('projectId') projectId) {
    return await this.likeService.createLike({
      userId: req.user.userId,
      projectId: projectId,
    });
  }
}
