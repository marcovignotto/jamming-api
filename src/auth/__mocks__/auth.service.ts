// mock the auth service

import {
  credentialUserGeneral,
  tokenUserGeneral,
} from '../../e2eTests/stubs/users.stubs';

export const AuthService = jest.fn().mockReturnValue({
  getUserData: jest.fn().mockResolvedValue(credentialUserGeneral()),
  login: jest.fn().mockResolvedValue({ access_token: tokenUserGeneral() }),
});
