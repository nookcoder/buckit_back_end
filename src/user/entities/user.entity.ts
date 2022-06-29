import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Like } from '../../like/entities/like.entity';
import { Order } from '../../order/entities/order.entity';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  Client = 'client',
  Admin = 'admin',
}

@Entity()
export class User extends CoreEntity {
  // todo : 인증 받아오면 nullable 삭제
  @Column({ nullable: true, default: 'Lex' })
  name: string;

  @Column({ nullable: true, default: 'MALE' })
  gender: string;

  @Column({ nullable: true, default: '1998-05-16' })
  birth: string;

  @Column({ unique: true })
  @MinLength(10)
  @MaxLength(12)
  phoneNumber: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
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
  @Column({ nullable: true, unique: true })
  accountNumber: string;

  // todo : 좋아요, 주문 정보 추가하기
  @OneToMany(() => Like, (like) => like.userId, { nullable: true })
  likes: Like[];

  @OneToMany(() => Order, (order) => order.user, { nullable: true })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
    return;
  }
}
