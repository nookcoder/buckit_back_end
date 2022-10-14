export function requestDepositTemplate(name: string, total: number) {
  return (
    '[(주) 버닝서프라이즈] 블럭 구매 입금 요청 안내\n' +
    '\n' +
    name +
    '님 안녕하세요!\n' +
    '주문하신 블럭의 구매를 위해 입금이 필요합니다.\n' +
    '\n' +
    '- 계좌정보 : 국민은행 01250104322726\n' +
    '- 예금주 : (주)버닝서프라이즈\n' +
    '- 입금액 : ' +
    total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '원\n' +
    '\n' +
    '\n' +
    '※ 신청내역은 MY BUCKIT → 예약된 프로젝트에서 확인이 가능합니다.'
  );
}

export function completionDepositTemplate(
  name: string,
  total: number,
  createdAt: string,
  quarter: number
) {
  return (
    '[(주)버닝서프라이즈] 블럭 구매 입금완료!\n' +
    '\n' +
    name +
    '님 안녕하세요!\n' +
    '주문하신 블럭의 구매가 완료되었습니다.\n' +
    '\n' +
    '- 구매 프로젝트 : 홍대 1차 프로젝트\n' +
    '- 구매 블럭 : ' +
    quarter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '\n' +
    '- 구매 금액 : ' +
    total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '\n' +
    '- 구매일 : ' +
    createdAt +
    '\n' +
    '\n' +
    '※ 구매내역은 MY BUCKIT → 영업 중인 프로젝트에서 확인이 가능합니다.\n' +
    '\n' +
    '※버킷 1차 프로젝트에 투자한 사장님만을 위한 카카오톡 채팅방!\n' +
    '- 참여코드 : buckit!!\n' +
    '\n' +
    '오픈 예정인 프로젝트에 대해 사장님의 의견과 아이디어를 자유롭게 말해주세요!\n'
  );
}

export function completionDepositTemplateWhenFail(
  name: string,
  total: number,
  createdAt: string,
  quarter: number
) {
  return (
    '[(주)버닝서프라이즈] 블럭 구매 입금완료!\n' +
    '\n' +
    name +
    '님 안녕하세요!\n' +
    '주문하신 블럭의 구매가 완료되었습니다.\n' +
    '\n' +
    '- 구매 프로젝트 : 홍대 1차 프로젝트\n' +
    '- 구매 블럭 : ' +
    quarter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '\n' +
    '- 구매 금액 : ' +
    total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '\n' +
    '- 구매일 : ' +
    createdAt +
    '\n' +
    '\n' +
    '※ 구매내역은 MY BUCKIT → 영업 중인 프로젝트에서 확인이 가능합니다.\n' +
    '\n' +
    '※버킷 1차 프로젝트에 투자한 사장님만을 위한 카카오톡 채팅방!\n' +
    'https://open.kakao.com/o/gcofaeGe\n' +
    '- 참여코드 : buckit!!\n' +
    '\n' +
    '오픈 예정인 프로젝트에 대해 사장님의 의견과 아이디어를 자유롭게 말해주세요!\n'
  );
}

export function talkButtonInfo() {
  return JSON.stringify({
    button: [
      {
        name: '신청내역 확인하기',
        linkType: 'WL',
        linkTypeName: '웹링크',
        linkMo: 'https://www.buckit.me/my-page',
      },
    ],
  });
}

export function talkCompletionButtonInfo() {
  return JSON.stringify({
    button: [
      {
        name: '사장님 채팅방 입장',
        linkType: 'WL',
        linkTypeName: '웹링크',
        linkMo: 'https://open.kakao.com/o/gcofaeGe',
        linkPc: 'https://open.kakao.com/o/gcofaeGe',
      },
    ],
  });
}
