import { Injectable, Logger } from '@nestjs/common';
import { PaymentSuccessEvent } from '../order/events/payment-success.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly orderService: OrderService
  ) {}
  private readonly logger = new Logger(PaymentService.name);

  async triggerPaymentSuccess(orderCode: string) {
    const paymentSuccessEvent = new PaymentSuccessEvent();
    const order = await this.orderService.findOrderByOrderCode(orderCode);
    if (!order) {
      this.logger.error(`
        message : "Can't Find Order that order_code is ${orderCode} 
      `);
      return {
        ok: false,
      };
    }

    paymentSuccessEvent.order = order;
    paymentSuccessEvent.orderCode = orderCode;
    paymentSuccessEvent.user = order.user;
    paymentSuccessEvent.project = order.project;
    paymentSuccessEvent.quarterQty = order.quarter_qty;

    this.eventEmitter.emit('payment.success', paymentSuccessEvent);
    return {
      ok: true,
    };
  }
}
