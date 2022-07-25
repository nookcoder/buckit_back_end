import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class ProfitService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async servePointsToUsers(pointsToBeAdded: number, phoneNumbers: string[]) {
    let user: User;
    let totalPoints: number;
    console.log(phoneNumbers);
    for (const phoneNumber of phoneNumbers) {
      console.log(phoneNumber);
      user = await this.userRepository.findOne({
        where: {
          phoneNumber,
        },
      });
      if (user) {
        totalPoints = user.points + pointsToBeAdded;
        await this.userRepository.update(user.id, { points: totalPoints });
        console.log('Find User');
        console.log(`totalPoints : ${totalPoints}`);
      }
    }
  }
}
