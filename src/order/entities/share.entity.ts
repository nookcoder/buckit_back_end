import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { IsNumber } from 'class-validator';
import { Dividend } from './dividend.entity';

@Entity()
export class Share extends CoreEntity {
  @ManyToOne((type) => Project, (project) => project.shareHolders, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @RelationId((self: Share) => self.project)
  project_id: number;

  @ManyToOne((type) => User, (user) => user.shares, {
    onDelete: 'CASCADE',
  })
  shareHolder: User;

  @RelationId((self: Share) => self.shareHolder)
  shareHolder_id: number;

  @OneToMany((type) => Dividend, (dividend) => dividend.share, {
    cascade: true,
  })
  dividends: Dividend[];
}
