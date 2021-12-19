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

// bob dylan
const userBobDylan = {
  firstName: 'Bod',
  lastName: 'Dylan',
  email: 'bobdylan@gmail.com',
  password: '12345678',
  instrument: 'Harmonica',
  role: 'user',
};

// token with bob Dylan credentials
// to simplify authorization

export const tokenBodDylan = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJvYmR5bGFuQGdtYWlsLmNvbSIsImlhdCI6MTYzOTkzMDQ1MSwiZXhwIjoxNjQ1MTE0NDUxfQ.QuxidLg9mGLTmOR4s-Zpfq6Dubt_Hee9u782fFYGrMQ';

export const credentialBobDylan = (): object => {
  return userBobDylan;
};

// Neil Young
const userNeilYoung = {
  firstName: 'Neil',
  lastName: 'Young',
  email: 'neilyoung@gmail.com',
  password: '12345678',
  instrument: 'Guitar',
  role: 'user',
};

export const credentialNeilYoung = (): object => {
  return userNeilYoung;
};

// Joni Mitchell
const userJoniMitchell = {
  firstName: 'Joni',
  lastName: 'Mitchell',
  email: 'jonimitchel@gmail.com',
  password: '12345678',
  instrument: 'Voice',
  role: 'user',
};

export const credentialJoniMitchell = (): object => {
  return userJoniMitchell;
};

// John Coltrane
const userJohnColtrane = {
  firstName: 'John',
  lastName: 'Coltrane',
  email: 'johncoltrane@gmail.com',
  password: '12345678',
  instrument: 'Sax',
  role: 'user',
};

export const credentialJohnColtrane = (): object => {
  return userJohnColtrane;
};

// Yoko Ono
const userYokoOno = {
  firstName: 'Yoko',
  lastName: 'Ono',
  email: 'yokoono@gmail.com',
  password: '12345678',
  instrument: 'Voice',
  role: 'user',
};

export const credentialYokoOno = (): object => {
  return userYokoOno;
};
