import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';

import { AuthService } from '../auth.service';
import { User } from '../../schemas/user.schema';

import {
  tokenUserGeneral,
  credentialUserGeneral,
} from '../../test/stubs/users.stubs';

// mock the service
jest.mock('../auth.service.ts');

// test objs
const testToken = { access_token: tokenUserGeneral() };
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
      // makes the request with a token
      beforeEach(async () => {
        user = await controller.getUserData(testToken);
      });

      // check if it's called
      it('then it should call getUserData', () => {
        expect(service.getUserData).toBeCalledWith(testToken);
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
