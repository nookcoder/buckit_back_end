import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsEnum, IsNumber } from 'class-validator';
import { Account } from './account.entity';

enum AccountHistoryType {
  DEPOSIT,
  WITHDRAW,
  DIVIDEND,
}

@Entity()
export class AccountHistory extends CoreEntity {
  @Column({ type: 'enum', enum: AccountHistoryType })
  @IsEnum(AccountHistoryType)
  transaction_type: AccountHistoryType;

  @Column()
  @IsNumber()
  amount: number;

  @ManyToOne((type) => Account, (account) => account.history)
  account: Account;
}
