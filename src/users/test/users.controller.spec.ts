import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import { User } from '../../schemas/user.schema';

import {
  credentialUserGeneral,
  credentialUserAdmin,
} from '../../test/stubs/users.stubs';

// mock the service
jest.mock('../users.service.ts');

// objs
// post
const objUserPost = {
  firstName: credentialUserGeneral()['firstName'],
  lastName: credentialUserGeneral()['lastName'],
  email: credentialUserGeneral()['email'],
  password: credentialUserGeneral()['password'],
  instrument: credentialUserGeneral()['instrument'],
  role: credentialUserGeneral()['role'],
};
// update
const objUserUpdate = {
  firstName: credentialUserAdmin()['firstName'],
  lastName: credentialUserAdmin()['lastName'],
  email: credentialUserAdmin()['email'],
  password: credentialUserAdmin()['password'],
  instrument: credentialUserAdmin()['instrument'],
  role: credentialUserAdmin()['role'],
};

describe.skip('UsersController', () => {
  // set controller and service
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    // clear mocks
    // clear before each test
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    describe('When getAllUsers is called', () => {
      // assign model
      let users: User[];

      //  call with the controller
      beforeEach(async () => {
        users = await usersController.getAllUsers();
      });
      // check if the functions are called by the cotrnoller
      test('then it should call getAllUsers', () => {
        expect(usersService.getAllUsers).toBeCalled();
      });

      test('then it should return an array', () => {
        expect(users).toEqual([credentialUserGeneral()]);
      });
    });
  });

  describe('postUser', () => {
    describe('When postUser', () => {
      // assign model
      let user: User;

      // call the controller
      beforeEach(async () => {
        user = await usersController.postUser(objUserPost);
      });

      test('then it should call postUser', () => {
        expect(usersService.postUser).toBeCalledWith(objUserPost);
      });

      test('then it should return the user', () => {
        expect(user).toEqual(objUserPost);
      });
    });
  });

  describe('updateUser', () => {
    describe('When updateUser', () => {
      // assign model
      let user: User;

      // call the controller
      beforeEach(async () => {
        user = await usersController.updateUser('fakeId', objUserUpdate);
      });

      test('then it should call updateUser', () => {
        expect(usersService.updateUser).toBeCalledWith('fakeId', objUserUpdate);
      });

      test('then it should return the user', () => {
        expect(user).toEqual(objUserUpdate);
      });
    });
  });

  describe('deleteUser', () => {
    describe('When deleteUser', () => {
      // assign model
      let user: string;

      // call the controller
      beforeEach(async () => {
        // takes req {user: {...}}
        user = await usersController.deleteUser('fakeId', {
          user: {
            email: credentialUserGeneral()['email'],
            userId: 'string',
          },
        });
      });

      test('then it should call updateUser', () => {
        // returns the req.user {email:...}
        expect(usersService.deleteUser).toBeCalledWith('fakeId', {
          email: credentialUserGeneral()['email'],
          userId: 'string',
        });
      });

      test('then it should return a string', () => {
        expect(user).toEqual(
          `User ${credentialUserGeneral()['firstName']} ${
            credentialUserGeneral()['lastName']
          } deleted!`,
        );
      });
    });
  });
});
