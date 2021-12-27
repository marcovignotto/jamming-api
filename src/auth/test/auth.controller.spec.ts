import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';

import { AuthService } from '../auth.service';

import { credentialUserGeneral } from '../../e2eTests/stubs/users.stubs';

// mock the service
jest.mock('../auth.service.ts');

// test objs
const testLogin = {
  email: credentialUserGeneral()['email'],
  password: credentialUserGeneral()['password'],
};

// the AuthService contains also validateUser
// but is tested through getUSerData

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    // clear mocks
    // clear before each test
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    describe('When getUserData is called', () => {
      // model
      let user: any;

      // call with the ctrl
      // just for the unit test makes the request
      // with a user email instead of the token
      beforeEach(async () => {
        user = await controller.getUserData({
          user: {
            email: credentialUserGeneral()['email'],
          },
        });
      });

      // check if it's called
      // the service gets called with user email
      it('then it should call getUserData', () => {
        expect(service.getUserData).toBeCalledWith({
          email: credentialUserGeneral()['email'],
        });
      });

      // check returned values
      it('then it should return the user', () => {
        expect(user).toEqual(credentialUserGeneral());
      });
    });
  });

  describe('login', () => {
    describe('When login is called', () => {
      //
      let token: object;

      // call the ctrl
      beforeEach(async () => {
        token = await controller.login(testLogin);
      });

      // check call
      it('then it should call', () => {
        expect(service.login).toBeCalledWith(testLogin);
      });

      // check value
      it('then it sould return a toke', () => {
        expect(token).toEqual(token);
      });
    });
  });
});
