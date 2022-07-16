import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // 결제 전 프로젝트 정보
  @UseGuards(JwtAuthGuard)
  @Get('/projects')
  async getProjectsBeforePayment(@Request() req) {
    const { userId } = req.user;
    return await this.orderService.getProjectsBeforePayment(userId);
  }

  // 주문 생성
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Request() req,
    @Body('qty') qty: string,
    @Body('projectId') projectId: string
  ) {
    const { userId } = req.user;

    return await this.orderService.createOrder(userId, +projectId, +qty);
  }
  // 입금 확인, API 연동후 Redirect로 쓰는 게 좋을 듯
  @Post('/payment')
  async completePayment() {}
  // 취소 및 환불
  @UseGuards(JwtAuthGuard)
  @Post('/cancel')
  async cancelPayment() {}
  // 주문 상태 업데이트 - Batch
}
