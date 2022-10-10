import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderInput, CreateOrderOutput } from './dto/create_order.dto';
import { CancelOrderInput } from './dto/cancel-order.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/api/v1/order')
@ApiTags('Order API')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 주문 생성 API
   * @param req
   * @param createOrderInput
   */
  @Post('/new')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '주문 생성 API',
    description: '주문 생성 API, Bearer 필수',
  })
  @ApiCreatedResponse({
    type: CreateOrderOutput,
  })
  async createOrder(
    @Request() req,
    @Body() createOrderInput: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    const { userId } = req.user;
    return await this.orderService.createNewOrder(userId, createOrderInput);
  }

  /**
   * 주문 취소 API
   * @param req
   * @param order_code
   */
  @Delete('/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Request() req, @Body() { order_code }: CancelOrderInput) {
    const { userId } = req.user;
    return await this.orderService.cancelOrder(userId, order_code);
  }

  @Get('/all')
  async getAllOrders() {}

  @Get('/before-payment')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req) {
    const { userId } = req.user;
    return await this.orderService.getMyOrders(userId);
  }

  @Get('/:orderCode')
  async getOrder() {}
  // todo : 결재 성공 시 orderStatus 변경, 실패 시 order 삭제 -> subscribe 사용
  // 주문 취소
}
