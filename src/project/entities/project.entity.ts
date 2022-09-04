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
import { Category } from './category.entity';
import { Orders } from '../../order/entities/order.entity';

export enum ProjectStatus {
  Any = 'any',
  Before = 'before',
  FundingPROGRESS = 'progress',
  FundingEnd = 'end',
  Opening = 'opening',
}

@Entity()
export class Project extends CoreEntity {
  @Column({ nullable: true })
  uuid: string;

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

  @Column({ nullable: true })
  fundingOpenDate: Date;

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

  @ManyToOne(() => Category, (category) => category.projects)
  category: Category;

  @OneToMany(() => Like, (like) => like.project, { nullable: true })
  likes: Like[];

  @OneToMany((type) => Orders, (order) => order.project_id, { nullable: true })
  orders: Orders[];

  @BeforeInsert()
  @BeforeUpdate()
  async calculateQuarter() {
    this.totalQuarter = this.total / this.pricePerQuarter;
  }
}
