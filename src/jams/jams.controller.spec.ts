import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { JamsController } from './jams.controller';
import { JamsService } from './jams.service';

import { UserSchema } from '../schemas/user.schema';
import { JamSchema } from '../schemas/jam.schema';

describe('JamsController', () => {
  let controller: JamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Jam', schema: JamSchema }]),
      ],
      controllers: [JamsController],
      providers: [JamsService],
    }).compile();

    controller = module.get<JamsController>(JamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
