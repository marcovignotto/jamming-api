/**
 * @desc all the tests for the route /auth
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import { credentialUserGeneral, tokenUserGeneral } from './stubs/users.stubs';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// test obj
const objPostUserGeneral = credentialUserGeneral();

// paths
const PATH_USERS = API_VERSION + '/users';
const PATH_AUTH = API_VERSION + '/auth';

describe.skip('/auth CRUD', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // simulate a nest runtime env
    app = moduleFixture.createNestApplication();
    // init the app
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // flow of to login and get a token to reuse
  // the user will get immediatly a valid token
  describe('/auth - GET - POST', () => {
    let userTodelete = '';

    // Important
    // this test its just to create a user for the auth test
    it('Create the test user for the next test', async () => {
      // request into var
      const req = await request(app.getHttpServer())
        .post(API_VERSION + '/users')
        .send(objPostUserGeneral)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      expect.assertions(3);
      userTodelete = req._id;
      // use returned values
      expect(req.firstName).toBe(objPostUserGeneral['firstName']);
      expect(req.lastName).toBe(objPostUserGeneral['lastName']);
      expect(req.email).toBe(objPostUserGeneral['email']);
    });

    // store token for get request
    let token = '';
    // the user tot request the token
    // has to be the one created in the previous test

    const userRequestToken = {
      email: objPostUserGeneral['email'],
      password: objPostUserGeneral['password'],
    };

    it('POST Error > 401 "Unauthorized"', async () => {
      await request(app.getHttpServer())
        .post(PATH_AUTH + '/login')
        .send({ ...userRequestToken, email: 'wrong@email.com' })
        .expect(401)
        .then((res) => res.body);
    });

    it('POST > 200 and get a token', async () => {
      const req = await request(app.getHttpServer())
        .post(PATH_AUTH + '/login')
        .send(userRequestToken)
        .expect(201)
        .then((res) => res.body);

      expect.assertions(1);

      // returned value
      expect(req.access_token).toBeTruthy();

      // save toke for next test
      token = req.access_token;
    });

    // uses the to get the data of the just registered user
    it('GET > 200 and user data ', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_AUTH)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(3);

      // use returned values
      expect(req['firstName']).toBe(objPostUserGeneral['firstName']);
      expect(req['lastName']).toBe(objPostUserGeneral['lastName']);
      expect(req['email']).toBe(objPostUserGeneral['email']);
    });

    // the admin deletes the user
    it('DELETE user with admin credentials > 200 and delete confirmation', async () => {
      const req = await request(app.getHttpServer())
        .delete(PATH_USERS + `/${userTodelete}`) // the same as update
        .set('Authorization', 'Bearer ' + tokenUserGeneral())
        .expect(200)
        .then((res) => res.text);

      expect.assertions(4);

      expect(req).toContain('User');
      expect(req).toContain(objPostUserGeneral['firstName']);
      expect(req).toContain(objPostUserGeneral['lastName']);
      expect(req).toContain('deleted');
    });
  });
});
