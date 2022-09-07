import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Share } from './entities/share.entity';
import { Repository } from 'typeorm';
import { Dividend } from './entities/dividend.entity';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
    @InjectRepository(Dividend)
    private readonly dividendRepository: Repository<Dividend>
  ) {}

  private readonly logger = new Logger(ShareService.name);

  async grantShare(user: User, project: Project, shareNumber: number) {
    try {
      const share = await this.shareRepository.create({
        total_share_number: shareNumber,
      });
      share.shareHolder = user;
      share.project = project;
      await this.shareRepository.save(share);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
