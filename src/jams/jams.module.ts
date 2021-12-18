import { Module } from '@nestjs/common';
import { JamsService } from './jams.service';
import { JamsController } from './jams.controller';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JamsService],
  controllers: [JamsController],
})
export class JamsModule {}
