import { IsNumber } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Like } from './entities/like.entity';

export class LikeInput extends PickType(Like, ['projectId', 'userId']) {
  @IsNumber()
  @ApiProperty()
  projectId: number;

  @IsNumber()
  @ApiProperty()
  userId: number;
}
