import { Body, Controller, Delete, Request, UseGuards } from '@nestjs/common';
import { ShareService } from './share.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('api/v1/share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Delete('/give-up')
  @UseGuards(JwtAuthGuard)
  async giveUpShare(@Request() req, @Body('share_uuid') shareUuid: string) {
    const { userId } = req.user;
    return await this.shareService.giveUpShare(userId, shareUuid);
  }
}
