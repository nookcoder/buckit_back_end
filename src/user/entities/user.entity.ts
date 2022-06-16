import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Like } from '../../like/entities/like.entity';
import { Order } from '../../order/entities/order.entity';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export enum UserRole {
  Client = 'client',
  Admin = 'admin',
}

@Entity()
export class User extends CoreEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column()
  @MinLength(10)
  @MaxLength(12)
  phoneNumber: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  termsOfService: boolean;

  @Column({ default: true })
  termsOfPrivacy: boolean;

  @Column()
  termsOfMarketing: boolean;

  // 예치금 넣었을 때 포인트 변환
  @Column({ default: 0 })
  points: number;

  // 개인 발급 계좌
  @Column({ nullable: true })
  accountNumber: string;

  // todo : 좋아요, 주문 정보 추가하기
  @Column('simple-array', { array: true, nullable: true })
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @Column('simple-array', { array: true, nullable: true })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
