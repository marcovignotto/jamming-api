import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JamsService } from './jams.service';
import { JamsController } from './jams.controller';

import { ConfigModule } from '@nestjs/config';

// Schemas
import { UserSchema } from '../schemas/user.schema';
import { JamSchema } from '../schemas/jam.schema';

@Module({
  imports: [
    ConfigModule,
    // the schema will be available in service
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Jam', schema: JamSchema }]),
  ],
  providers: [JamsService],
  controllers: [JamsController],
})
export class JamsModule {}
