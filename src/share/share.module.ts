import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dividend } from './entities/dividend.entity';
import { Share } from './entities/share.entity';
import { ShareController } from './share.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([Share, Dividend]), ProjectModule],
  providers: [ShareService],
  exports: [ShareService],
  controllers: [ShareController],
})
export class ShareModule {}
