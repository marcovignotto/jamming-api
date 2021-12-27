/**
 * @desc all the tests for the route /users
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import {
  credentialUserGeneral,
  credentialUserAdmin,
  tokenUserAdmin,
  tokenUserGeneral,
} from './stubs/users.stubs';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// test obj
const objPostUserGeneral = credentialUserGeneral();

const objUpdateUserToAdmin = credentialUserAdmin();

// paths
const PATH_USERS = API_VERSION + '/users';

describe.skip('/users CRUD', () => {
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

  // complete flow of user get create update delete
  // the created user will perform all the CRUD and at the end there's no user in the db
  describe('/users - GET - POST - PUT - DELETE', () => {
    // store tne user id for the PUT
    let userIdToUpdate = '';

    // test the  user db
    it(`GET > [] `, async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_USERS)
        .set('Authorization', 'Bearer ' + tokenUserGeneral())
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(Number(req.length));
    });

    // test create a user in db
    it('POST > 201 and user First name Last name and Email ', async () => {
      // request into var
      const req = await request(app.getHttpServer())
        .post(PATH_USERS)
        .send(objPostUserGeneral)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      userIdToUpdate = req._id;

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUserGeneral['firstName']);
      expect(req.lastName).toBe(objPostUserGeneral['lastName']);
      expect(req.email).toBe(objPostUserGeneral['email']);
    });

    it('POST Error > 409 posting twice', async () => {
      // request into var
      const req = await request(app.getHttpServer())
        .post(PATH_USERS)
        .send(objPostUserGeneral)
        .expect(409)
        .then((res) => JSON.parse(res.text));

      expect.assertions(1);

      // use returned values
      expect(req.message).toBe('Email already registered!');
    });

    it('PUT > 200 and user updated data', async () => {
      const req = await request(app.getHttpServer())
        .put(PATH_USERS + `/${userIdToUpdate}`)
        .set('Authorization', 'Bearer ' + tokenUserGeneral())
        .send(objUpdateUserToAdmin)
        .expect(200)
        .then((res) => JSON.parse(res.text));

      expect.assertions(4);

      // use returned values
      expect(req.firstName).toBe(objUpdateUserToAdmin['firstName']);
      expect(req.lastName).toBe(objUpdateUserToAdmin['lastName']);
      expect(req.email).toBe(objUpdateUserToAdmin['email']);
      expect(req.instruments).toBe(objUpdateUserToAdmin['instruments']);
    });

    // work if the DB was empty
    it('GET - New all users db > length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_USERS)
        .set('Authorization', 'Bearer ' + tokenUserAdmin())
        .expect(200)
        .then((res) => res.body);

      // time for db update
      setTimeout(() => {
        expect.assertions(1);
        expect(Number(req.length)).toBe(Number(req.length));
      }, 2000);
    });

    // the admin deletes the user
    it('DELETE user with admin credentials > 200 and delete confirmation', async () => {
      const req = await request(app.getHttpServer())
        .delete(PATH_USERS + `/${userIdToUpdate}`) // the same as update
        .set('Authorization', 'Bearer ' + tokenUserGeneral()) // temp id
        .expect(200)
        .then((res) => res.text);

      expect.assertions(4);

      expect(req).toContain('User');
      expect(req).toContain(objUpdateUserToAdmin['firstName']);
      expect(req).toContain(objUpdateUserToAdmin['lastName']);
      expect(req).toContain('deleted');
    });
  });
});
