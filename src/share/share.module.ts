import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dividend } from './entities/dividend.entity';
import { Share } from './entities/share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Share, Dividend])],
  providers: [ShareService],
  exports: [ShareService],
})
export class ShareModule {}
