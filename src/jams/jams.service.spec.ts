import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { JamsService } from './jams.service';

import { UserSchema } from '../schemas/user.schema';
import { JamSchema } from '../schemas/jam.schema';

// interfaces

// interfaces
import { IJam } from '../interfaces/jam.interfaces';
import { DatabaseModule } from '../database/database.module';

// test var / objs
const testGetAllJamsArray = [
  { jamName: 'one' },
  { jamName: 'two' },
  { jamName: 'three' },
];

const testPostJamObj = {
  hostEmail: 'email',
  jamName: 'Jamming with Mr Tamburine',
  jamUrl: 'jamming-with-mr-tamburine',
  instruments: ['Guitar', 'Voice', 'Sax'],
  totalNumberOfPlayers: 4,
  kindOfMusic: 'Rock Folk Jazz ',
};
const testUpdateJamObj = { jamName: 'one UPDATED' };
const testDeleteJamString = 'Jam number 9 deleted!';

// class to mock functions
class JamsServiceMock {
  getAllJams(all, body): object[] {
    return testGetAllJamsArray;
  }
  postJam(obj: object | any): object {
    return obj;
  }
  updateJam(url, user): object {
    return testUpdateJamObj;
  }
  deleteJam(url, user): string {
    return testDeleteJamString;
  }
}

describe.skip('JamsService', () => {
  let service: JamsService;

  const JamsServiceProvider = {
    provide: JamsService,
    useClass: JamsServiceMock, // mocks UserServices overides provide
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/newTest'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Jam', schema: JamSchema }]),
      ],
      providers: [JamsService, JamsServiceProvider],
    }).compile();

    service = module.get<JamsService>(JamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllJams() > array of 3 objs', () => {
    const expectedResult = testGetAllJamsArray;

    const res = service.getAllJams(true, { body: 'foo' });

    expect(res).toBe(expectedResult);
  });
  it('postJam() > jam obj', () => {
    const expectedResult = testPostJamObj;

    const res = service.postJam(testPostJamObj);

    expect(res).toBe(expectedResult);
  });
  it('updateJam()  > jam obj updated', () => {
    const expectedResult = testUpdateJamObj;

    const res = service.updateJam(
      { url: 'jam-url' },
      { email: 'email@gmail.com' },
    );

    expect(res).toBe(expectedResult);
  });
  it('deleteJam() > string deletion', () => {
    const expectedResult = testDeleteJamString;

    const res = service.deleteJam(
      { url: 'jam-url' },
      { email: 'email@gmail.com' },
    );

    expect(res).toBe(expectedResult);
  });
});
