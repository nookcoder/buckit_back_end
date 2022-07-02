import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/api/v1')
export class AppController {
  @Get('/ping')
  @HttpCode(200)
  ping(): string {
    return 'pong';
  }
}
