import {
  Body,
  Controller,
  Delete,
  Get, Param,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {Share} from "./entities/share.entity";

@Controller('api/v1/share')
@ApiTags('주식 관련 API')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Delete('/give-up')
  @UseGuards(JwtAuthGuard)
  async giveUpShare(@Request() req, @Body('share_uuid') shareUuid: string) {
    const { userId } = req.user;
    return await this.shareService.giveUpShare(userId, shareUuid);
  }

  @Get('/mine')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: Array<Share>
  })
  @ApiOperation({
    summary: '주식 조회 API',
    description: '본인이 소유한 프로젝트 조회(결제 완료)',
  })
  async getMyShares(@Req() req) {
    const { userId } = req.user;
    return this.shareService.getMyShares(userId);
  }

  @Get('/mine/:id')
  @UseGuards(JwtAuthGuard)
  async getMyShare(@Req() req, @Param('id') shareId){
    const {userId} = req.user;
    return this.shareService.getMyShare(userId, shareId);
  }
}
