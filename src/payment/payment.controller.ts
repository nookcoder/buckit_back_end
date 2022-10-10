import { Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/payment')
@ApiTags('Payment API')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: '입금확인 API',
    description: '주문 코드를 입력하면 입금 완료',
  })
  @Post('/:order_code')
  async triggerPaymentSuccess(@Param('order_code') orderCode: string) {
    return this.paymentService.triggerPaymentSuccess(orderCode);
  }
}
