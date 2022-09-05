import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { FundingService } from './funding.service';
import { CreateOrderInput } from './dto/create_order.dto';
import { CancelOrderInput } from './dto/cancel-order.dto';

@Controller('/api/v1/funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  // 주문 생성
  // user -> get from access tokens
  // project id ->
  // 블럭 당 가격 -> body
  // 주문한 총 블럭 수
  // 프로젝트 유무 판단
  // subscribe 로 pending 수정
  @Post('/new')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Request() req,
    @Body() createOrderInput: CreateOrderInput
  ) {
    const { userId } = req.user;
    return await this.fundingService.createNewOrder(userId, createOrderInput);
  }

  @Delete('/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Request() req, @Body() { order_code }: CancelOrderInput) {
    const { userId } = req.user;
    return await this.fundingService.cancelOrder(userId, order_code);
  }

  @Get('/all')
  async getAllOrders() {}

  @Get('/:orderCode')
  async getOrder() {}
  // todo : 결재 성공 시 orderStatus 변경, 실패 시 funding 삭제 -> subscribe 사용
  // 주문 취소
}
