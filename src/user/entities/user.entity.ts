import { Column, Entity } from 'typeorm';
import { Core } from '../../common/entities/core.entity';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User extends Core {
  @Column()
  @IsString()
  @Field(() => String)
  phoneNumber: string;

  @Column()
  @IsEmail()
  @Field(() => String)
  email: string;

  @Column()
  @IsString()
  @Field(() => String)
  password: string;

  // 서비스 이용 약관 동의
  @Column({ default: true })
  @IsBoolean()
  @Field(() => Boolean)
  termOfService: boolean;

  // 개인정보 처리방침
  @Column({ default: true })
  @IsBoolean()
  @Field(() => Boolean)
  privacyPolicy: boolean;

  // 마케팅 활용 동의
  @Column()
  @IsBoolean()
  @Field(() => Boolean)
  marketingConsent: boolean;

  // todo : 밑에 3개는 차후 추가
  @Column()
  @IsString()
  @Field(() => String)
  address: string;

  // 예치금
  @Column()
  @IsNumber()
  @Field(() => Number)
  deposit: number;

  @Column()
  @IsString()
  @Field(() => String)
  accountNumber: string;

  // todo: 수익금 내역
}
