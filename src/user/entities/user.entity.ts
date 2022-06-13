import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

enum UserRole {
  Client = 'client',
  Admin = 'admin',
}

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column()
  @IsString()
  phoneNumber: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: true })
  @IsBoolean()
  termsOfService: boolean;

  @Column({ default: true })
  @IsBoolean()
  termsOfPrivacy: boolean;

  @Column()
  @IsBoolean()
  termsOfMarketing: boolean;

  // 예치금 넣었을 때 포인트 변환
  @Column({ default: 0 })
  @IsNumber()
  points: number;

  // 개인 발급 계좌
  @Column({ nullable: true })
  @IsString()
  accountNumber: string;

  // todo : 좋아요, 주문 정보 추가하기
}
