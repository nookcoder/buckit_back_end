import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Project } from './project.entity';

@Entity()
export class Category extends CoreEntity {
  @Column()
  name: string;

  @OneToMany(() => Project, (project) => project.category, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  projects: Project[];
}
