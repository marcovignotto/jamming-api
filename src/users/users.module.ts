import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// import { UserSchema } from '../entities/user.entity';

import { UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    // the schema will be available in service
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
