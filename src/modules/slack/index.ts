import axios from 'axios';
import { Orders } from '../../order/entities/order.entity';
import { getEndTimeFormat } from '../../common/utils/parser';
import { Share } from '../../share/entities/share.entity';
import { Logger } from '@nestjs/common';

const { WebClient, LogLevel } = require('@slack/web-api');

const logger = new Logger('SLACK');

const client = new WebClient(`${process.env.SLACK_TOKEN}`, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

export const sendToSlack = async (order: Orders) => {
  try {
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: `${process.env.SLACK_ORDER_CHANNEL}`,
        text: `입금자명 : ${order.buyer_name}\n입금은행 : ${
          order.buyer_bank
        }\n주문한 총 블럭 수 : ${
          order.quarter_qty
        }\n주문한 총 금액 : ${Math.round(
          order.quarter_qty * order.project.pricePerQuarter * 1.033
        )}\n주문 마감 기한 : ${getEndTimeFormat(
          order.createdAt.toString()
        )}\n주문 코드 : ${order.order_code}
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
          'Content-type': 'application/json',
        },
      }
    );
  } catch (e) {
    logger.error(e);
    console.log(e);
  }
};

export const sendPaymentCompletionToSlack = async (
  order: Orders,
  share: Share
) => {
  try {
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: `${process.env.SLACK_PAYMENT_CHANNEL}`,
        text: `결제가 성공적으로 승인되었습니다.\n주문코드:${
          order.order_code
        }\n총 결제금액:${Math.round(
          share.total_share_number * share.project.pricePerQuarter * 1.033
        )}\n총 블럭 수:${share.total_share_number}\n프로젝트 소유자 명:${
          share.shareHolder.name
        }\n이메일:${share.shareHolder.email}\n전화번호:${
          share.shareHolder.phoneNumber
        }\n승인시각:${share.createdAt}
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
          'Content-type': 'application/json',
        },
      }
    );
  } catch (e) {
    logger.error(e);
    console.log(e);
  }
};
