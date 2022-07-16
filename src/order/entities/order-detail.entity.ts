import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { IsBoolean, IsNumber } from 'class-validator';

@Entity()
export class OrderDetail extends CoreEntity {
  @OneToOne((type) => Order, (order) => order.orderNumber, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  @Column()
  @IsNumber()
  qty: number;

  @Column()
  @IsNumber()
  total: number;

  @Column()
  @IsNumber()
  pricePerQuarter: number;

  @Column('boolean', { select: false, default: true })
  @IsBoolean()
  thirdPartyConsent;

  @Column('boolean', { select: false, default: true })
  @IsBoolean()
  fundingNotes;

  // 가상계좌번호, 입금자정보, 등등 추가 예정
}
