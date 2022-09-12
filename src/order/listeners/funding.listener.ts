import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentSuccessEvent } from '../events/payment-success.event';
import { OrderService } from '../order.service';
import { OrderStatusType } from '../entities/order.entity';
import { ShareService } from '../../share/share.service';

@Injectable()
export class FundingListener {
  constructor(
    private readonly orderService: OrderService,
    private readonly shareService: ShareService
  ) {}

  private readonly logger = new Logger(FundingListener.name);

  /**
   * 결재 완료 시 주문 업데이트 및 Share 생성
   * @param event
   */
  @OnEvent('payment.success', { async: true })
  async updateOrderStatus(event: PaymentSuccessEvent) {
    try {
      const orderCode = event.orderCode;
      const order = await this.orderService.findOrderByOrderCode(orderCode);
      if (!order) {
        this.logger.error(`
        message : "Can't Find Order that order_code is ${orderCode} 
      `);
        return {
          ok: false,
          error: "Can't Find Order",
        };
      }

      await this.orderService.updateOrder(order.id, {
        order_status: OrderStatusType.APPROVAL,
      });
      // todo : share 생성 로직 추가
      await this.shareService.grantShare(
        event.user,
        event.project,
        event.quarterQty
      );
      // todo : 결재완료 알림을 여기서 하면 될까요???
    } catch (error) {
      this.logger.error(`
        message : Internal Server Error 
        error : ${error}
      `);
      return {
        ok: false,
        error,
      };
    }
  }
}
