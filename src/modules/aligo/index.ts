import * as aligoapi from 'aligoapi';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { create } from 'domain';

const HOST = 'https://kakaoapi.aligo.in:443';
const AUTH = '/akv10/token/create/30/s';
const SEND_TEMPLATE = '/akv10/alimtalk/send';
const REQUEST_TEMPLATE = 'TK_2145';
const COMPLETION_TEMPLATE = 'TK_2445';

const MESSAGE_HOST = 'https://apis.aligo.in:443';
const SEND_MESSAGE = '/send';

interface getAligoapiTokenResponse {
  code: number;
  message: string;
  token: string;
  urlencode: string;
}

const sendMessageContent = (total: number) => {
  return `(주)버닝서프라이즈 블럭 구매 입금 요청 안내
  %고객명%님 안녕하세요!
  주문하신 블럭의 구매를 위해
  입금이 필요합니다
  
  -계좌정보 : 국민은행 01250104322726
  -예금주 : (주)버닝서프라이즈
  -입금액 : ${total}원
  
  ※ 신청내역은 MY BUCKIT -> 결제 전 프로젝트에서 확인이 가능합니다`;
};

const sendCompletionMessage = (
  quarter: number,
  total: number,
  createdAt: string
) => {
  return `버킷 블럭 구매 입금완료!
  
%고객명%님 안녕하세요!
주문하신 블럭의 구매가 완료되었습니다.

- 구매 블럭 : ${quarter}개
- 구매 금액 : ${total}원
- 구매일 : ${createdAt}

※ 구매내역은 MY BUCKIT → 영업 중인 프로젝트에서 확인이 가능합니다.

※버킷 1차 프로젝트에 투자한 사장님만을 위한 카카오톡 채팅방!
- 참여코드 : buckit!!

오픈 예정인 프로젝트에 대해 사장님의 의견과 아이디어를 자유롭게 말해주세요!`;
};

const logger = new Logger('Aligo');

const getAligoapiToken = async () => {
  try {
    const url = `${HOST}${AUTH}?apikey=${process.env.ALIGO_API}&userid=${process.env.ALIGO_ID}`;
    const response = await axios.get(url);
    const data: getAligoapiTokenResponse = response.data;
    return data;
  } catch (e) {
    logger.error(e);
  }
};

export const sendRequestDepositAligoTemplate = async () => {
  try {
    const { token } = await getAligoapiToken();
    console.log(token);
    const url = `${HOST}${SEND_TEMPLATE}?apikey=${
      process.env.ALIGO_API
    }&userid=${process.env.ALIGO_ID}&token=${token}&senderkey=${
      process.env.ALIGO_SENDER_KEY
    }&tpl_code=${REQUEST_TEMPLATE}&sender=01050460649&receiver_1=01050477361&recvname_1=${encodeURI(
      '김현욱'
    )}`;
    const response = await axios.post(url);
    console.log(response.data);
  } catch (e) {
    logger.error(e);
  }
};

export const sendRequestDepositMessage = async (
  phoneNumber: string,
  name: string,
  total: number
) => {
  try {
    const url = `${MESSAGE_HOST}${SEND_MESSAGE}?key=${
      process.env.ALIGO_API
    }&user_id=${
      process.env.ALIGO_ID
    }&sender=01050460649&receiver=${phoneNumber}&msg=${sendMessageContent(
      total
    )}&destination=${phoneNumber}|${name}`;
    const encoded = encodeURI(url);
    await axios.post(encoded);
  } catch (e) {
    logger.error(e);
  }
};

export const sendCompletionDeposiMessage = async (
  phoneNumber: string,
  name: string,
  total: number,
  createdAt: string,
  quarter: number
) => {
  try {
    const url = `${MESSAGE_HOST}${SEND_MESSAGE}?key=${
      process.env.ALIGO_API
    }&user_id=${
      process.env.ALIGO_ID
    }&sender=01050460649&receiver=${phoneNumber}&msg=${sendCompletionMessage(
      quarter,
      total,
      createdAt
    )}&destination=${phoneNumber}|${name}`;
    const encoded = encodeURI(url);
    await axios.post(encoded);
  } catch (e) {
    logger.error(e);
  }
};
