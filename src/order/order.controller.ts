import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create_order.dto';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    @Request() req: Request,
    @Body() createOrderInput: CreateOrderInput
  ) {}

  // 주문 취소
}
