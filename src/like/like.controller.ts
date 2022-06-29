import { Body, Controller, Post } from '@nestjs/common';
import { CreateLikeInput } from './create-like.dto';
import { LikeService } from './like.service';

@Controller('api/v1/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async createLike(@Body() input: CreateLikeInput) {
    return await this.likeService.createLike(input);
  }
}
