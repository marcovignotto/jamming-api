import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { JamsService } from './jams.service';

import { UserSchema } from '../schemas/user.schema';
import { JamSchema } from '../schemas/jam.schema';

// interfaces

// export interface IGetJamsResponse

// test var / objs
const testGetAllJamsArray = [
  { jamName: 'one' },
  { jamName: 'two' },
  { jamName: 'three' },
];

const testPostJamObj = { jamName: 'one' };
const testUpdateJamObj = { jamName: 'one UPDATED' };
const testDeleteJamString = 'Jam number 9 deleted!';

// class to mock functions
class JamsServiceMock {
  getAllJams(): object[] {
    return testGetAllJamsArray;
  }
  postJam(): object {
    return testPostJamObj;
  }
  updateJam(): object {
    return testUpdateJamObj;
  }
  deleteJam(): string {
    return testDeleteJamString;
  }
}

describe('JamsService', () => {
  let service: JamsService;

  const JamsServiceProvider = {
    provide: JamsService,
    useClass: JamsServiceMock, // mocks UserServices overides provide
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/jammingTestDb'),
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

    const res = service.getAllJams();

    expect(res).toBe(expectedResult);
  });
  it('postJam() > jam obj', () => {
    const expectedResult = testPostJamObj;

    const res = service.postJam();

    expect(res).toBe(expectedResult);
  });
  it('updateJam()  > jam obj updated', () => {
    const expectedResult = testUpdateJamObj;

    const res = service.updateJam();

    expect(res).toBe(expectedResult);
  });
  it('deleteJam() > string deletion', () => {
    const expectedResult = testDeleteJamString;

    const res = service.deleteJam();

    expect(res).toBe(expectedResult);
  });
});
