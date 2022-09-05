import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from './user.entity';
import { IsNumber } from 'class-validator';
import { AccountHistory } from './account-history.entity';

@Entity()
export class Account extends CoreEntity {
  @OneToOne((type) => User, (user) => user.account)
  user: User;

  @Column()
  @IsNumber()
  deposit: number;

  @OneToMany((type) => AccountHistory, (history) => history.account, {
    cascade: true,
  })
  history: AccountHistory[];
}
