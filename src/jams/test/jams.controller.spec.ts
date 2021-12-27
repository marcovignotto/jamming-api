import { Test, TestingModule } from '@nestjs/testing';

import { credentialUserGeneral } from '../../e2eTests/stubs/users.stubs';
import { jamOne } from '../../e2eTests/stubs/jams.stubs';

import { JamsController } from '../jams.controller';
import { JamsService } from '../jams.service';

import { Jam } from '../../schemas/jam.schema';

// mock the service
jest.mock('../jams.service.ts');

// mock objs
const testUser = {
  email: credentialUserGeneral()['email'],
  password: credentialUserGeneral()['password'],
};

describe('JamsController', () => {
  let controller: JamsController;
  let service: JamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [JamsController],
      providers: [JamsService],
    }).compile();

    controller = module.get<JamsController>(JamsController);

    service = module.get<JamsService>(JamsService);

    // clear all the mock
    jest.clearAllMocks();
  });

  describe('getAllJams', () => {
    describe('When getAllJams is called', () => {
      // assign model
      let jams: Jam[];

      // call ctrl
      // takes obj containing user, {user:...}
      beforeEach(async () => {
        jams = await controller.getAllJams(true, { user: testUser });
      });

      // check the call
      // does not return {user:...}
      test('then it should call getAllJams', () => {
        expect(service.getAllJams).toBeCalledWith(true, testUser);
      });

      // check the value
      test('then it should return an array', () => {
        expect(jams).toEqual([jamOne()]);
      });
    });
  });

  describe('postJam', () => {
    describe('When postJam is called', () => {
      // assign model
      let jam: Jam;

      // call ctrl
      beforeEach(async () => {
        jam = await controller.postJam(jamOne());
      });

      // check the call
      test('then it should call postJam', () => {
        expect(service.postJam).toBeCalledWith(jamOne());
      });

      // check value
      test('then it should return the jam', () => {
        expect(jam).toEqual(jamOne());
      });
    });
  });

  describe('updateJam', () => {
    describe('When updateJam is called', () => {
      let jam: Jam;

      // call ctrl
      // takes obj containing user, {user:...}
      beforeEach(async () => {
        jam = await controller.updateJam('fakeID', { user: testUser });
      });

      // check call
      // does not return {user:...}
      test('then it should call updateJam', () => {
        expect(service.updateJam).toBeCalledWith('fakeID', testUser);
      });

      // check value
      test('then it should return the jam', () => {
        expect(jam).toEqual(jamOne());
      });
    });
  });

  describe('deleteJam', () => {
    describe('When deleteJam is called', () => {
      let jam: string;

      // call ctrl
      beforeEach(async () => {
        jam = await controller.deleteJam('fakeID', { user: testUser });
      });

      test('then it should call deleteJam', () => {
        expect(service.deleteJam).toBeCalledWith('fakeID', testUser);
      });

      test('then it should return a string', () => {
        expect(jam).toEqual(
          `${credentialUserGeneral()['firstName']} ${
            credentialUserGeneral()['lastName']
          } deleted the jam ${jamOne()['jamName']}`,
        );
      });
    });
  });
});
