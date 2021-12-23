// mocking the user service

import {
  credentialUserAdmin,
  credentialUserGeneral,
} from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getAllUsers: jest.fn().mockResolvedValue([credentialUserGeneral()]),
  postUser: jest.fn().mockResolvedValue(credentialUserGeneral()),
  updateUser: jest.fn().mockResolvedValue(credentialUserAdmin()),
  deleteUser: jest
    .fn()
    .mockResolvedValue(
      `User ${credentialUserGeneral()['firstName']} ${
        credentialUserGeneral()['lastName']
      } deleted!`,
    ),
});
