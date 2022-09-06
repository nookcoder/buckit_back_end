import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsNumber } from 'class-validator';
import { Share } from './share.entity';

@Entity()
export class Dividend extends CoreEntity {
  @Column()
  @IsNumber()
  dividend_per_quarter: number;

  @Column()
  @IsNumber()
  total_dividend: number;

  @Column()
  @IsNumber()
  quarter_qty: number;

  @ManyToOne((type) => Share, (share) => share.dividends, {
    onDelete: 'CASCADE',
  })
  share: Share;

  @RelationId((self: Dividend) => self.share)
  share_id: number;
}
