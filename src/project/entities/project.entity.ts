import { CoreEntity } from '../../common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { Like } from '../../like/entities/like.entity';
import { Order } from '../../order/entities/order.entity';
import { Category } from './category.entity';

export enum ProjectStatus {
  Before = 'before',
  FundingPROGRESS = 'progress',
  FundingEnd = 'end',
  Opening = 'opening',
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
  @Column('text', { nullable: true, array: true })
  @IsArray()
  content: string[];

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

  @ManyToOne(() => Category, (category) => category.projects, {
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Like, (like) => like.project, { nullable: true })
  likes: Like[];

  // //todo : 주문 테이블, 좋아요, 카테고리
  @OneToMany(() => Order, (order) => order.project, { nullable: true })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async calculateQuarter() {
    this.totalQuarter = this.total / this.pricePerQuarter;
  }
}
