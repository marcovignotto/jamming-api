// mock the jams service

import { jamOne } from '../../e2eTests/stubs/jams.stubs';
import { credentialUserGeneral } from '../../e2eTests/stubs/users.stubs';

export const JamsService = jest.fn().mockReturnValue({
  getAllJams: jest.fn().mockResolvedValue([jamOne()]),
  postJam: jest.fn().mockResolvedValue(jamOne()),
  updateJam: jest.fn().mockResolvedValue(jamOne()),
  deleteJam: jest
    .fn()
    .mockResolvedValue(
      `${credentialUserGeneral()['firstName']} ${
        credentialUserGeneral()['lastName']
      } deleted the jam ${jamOne()['jamName']}`,
    ),
});
