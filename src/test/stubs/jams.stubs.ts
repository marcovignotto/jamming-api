import { credentialBobDylan } from './users.stubs';

export const jamOne = (): object => {
  return {
    jamName: 'Jamming with Mr Tamburine',
    hostEmail: credentialBobDylan()['email'],
    instruments: ['Guitar', 'Voice', 'Sax'],
    totalNumberOfPlayers: 4,
    kindOfMusic: 'Rock Folk Jazz ',
  };
};
