/**
 * @desc returns test credentials for testing
 */

// creates an admin
const userAdmin = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@gmail.com',
  password: '12345678',
  instrument: 'Voice',
  role: 'admin',
};

// creates a general user with no admin power
const userGeneral = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
  instrument: 'Drum',
  role: 'user',
};

export const credentialUserAdmin = (): object => {
  return userAdmin;
};

export const credentialUserGeneral = (): object => {
  return userGeneral;
};
