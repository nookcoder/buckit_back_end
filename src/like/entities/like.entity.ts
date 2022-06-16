import { CoreEntity } from '../../common/entities/core.entity';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class Like extends CoreEntity {
  @ManyToOne(() => Project, (project) => project.likes)
  project: Project;

  @RelationId((like: Like) => like.project)
  projectId: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @RelationId((like: Like) => like.user)
  userId: number;
}
