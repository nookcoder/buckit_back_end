export class PaymentCompletedProject {
  orderId: number;
  projectId: number;
  projectStatus: string;
  orderNumber: string;
  thumbnailImageUrl: string;
  address: string;
  title: string;
  // 펀딩 총 가격
  total: number;
  // 구매수량
  qty: number;
  // 총 구매 가격
  purchaseTotal: number;
  // 판매된 쿼터수
  soldQuarter: number;
  // 총 쿼터수
  totalQuarter: number;
  // 쿼터당 가격
  pricePerQuarter: number;
  deadline: Date;
  orderUpdatedAt: Date;
}
