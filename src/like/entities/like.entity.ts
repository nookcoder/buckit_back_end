import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class Like extends CoreEntity {
  @ManyToOne(() => Project, (project) => project.likes, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @Column()
  userId: number;
}
