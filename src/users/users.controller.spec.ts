import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';

import { UserSchema } from '../schemas/user.schema';
import { JamSchema } from '../schemas/jam.schema';

console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // DatabaseModule,
        // MongooseModule.forRoot('mongodb://localhost/newTest'),

        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Jam', schema: JamSchema }]),
      ],

      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
