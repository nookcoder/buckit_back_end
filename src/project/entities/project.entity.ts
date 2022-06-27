import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Like } from '../../like/entities/like.entity';
import { Order } from '../../order/entities/order.entity';

export enum ProjectStatus {
  Before = 'before',
  PROGRESS = 'progress',
  END = 'end',
}

@Entity()
export class Project extends CoreEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  summary: string;

  // 프로모션 진행 시 띄울 이미지 -> 미리 넣어둔 것
  @Column({ nullable: true })
  @IsString()
  promotionContent: string;

  // 상세 내용 보기 -> 이미지 주소
  @Column({ nullable: true })
  @IsString()
  content: string;

  @Column()
  @IsString()
  address: string;

  @Column({ nullable: true })
  @IsString()
  thumbnailImage: string;

  @Column()
  deadline: Date;

  @Column({ type: 'enum', enum: ProjectStatus, default: 'before' })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  // 총 펀딩 금액
  @Column()
  @IsNumber()
  total: number;

  // 총 쿼터 수
  @Column()
  @IsNumber()
  totalQuarter: number;

  @Column({ default: 0 })
  @IsNumber()
  soldQuarter: number;

  // 한 쿼터 당 가격
  @Column()
  @IsNumber()
  pricePerQuarter: number;

  // 예상 수익 금액 -> 계산 방법 미정
  @Column({ nullable: true })
  @IsNumber()
  expectedProfit: number;

  @Column('simple-array', { array: true, default: [] })
  @OneToMany(() => Like, (like) => like.project, { onDelete: 'CASCADE' })
  likes: Like[];

  // //todo : 주문 테이블, 좋아요, 카테고리
  @Column('simple-array', { array: true, default: [], nullable: true })
  @OneToMany(() => Order, (order) => order.project, { onDelete: 'CASCADE' })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async calculateQuarter() {
    this.totalQuarter = this.total / this.pricePerQuarter;
  }
}
