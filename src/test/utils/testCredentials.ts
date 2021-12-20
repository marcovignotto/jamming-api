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
  firstName: 'Bob',
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

export const tokenNeilYoung = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5laWx5b3VuZ0BnbWFpbC5jb20iLCJpYXQiOjE2Mzk5Mzk4MDQsImV4cCI6MTY0NTEyMzgwNH0.XMSLqEMZa6HivlwnKpLWDb3tjsoY0a8-Kl4wqmigwLc';

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

export const tokenJoniMitchell = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvbmltaXRjaGVsQGdtYWlsLmNvbSIsImlhdCI6MTYzOTkzOTc2MSwiZXhwIjoxNjQ1MTIzNzYxfQ.KKbnnAfq-W3C_sRtjItrw7qzAjlIAUpE7_eueg3mZII';

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

export const tokenJohnColtrane = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5jb2x0cmFuZUBnbWFpbC5jb20iLCJpYXQiOjE2Mzk5Mzk2OTQsImV4cCI6MTY0NTEyMzY5NH0.6rvzpO6Pc7JWHi8L0lvDkhPbF_AtVmtYFGZ3s2aQe7I';

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

export const tokenYokoOno = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inlva29vbm9AZ21haWwuY29tIiwiaWF0IjoxNjM5OTM5ODQ1LCJleHAiOjE2NDUxMjM4NDV9.pI2Hwm35XJag003pHjQYPRP0vUoCESyxmg5Uym4Oopg';

export const credentialYokoOno = (): object => {
  return userYokoOno;
};
