import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as request from 'supertest';
import { AppModule } from '../app.module';

// test obj
const objPostUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
  instruments: ['Sax', 'Drum'],
  role: 'player',
};

const objUpdateUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@gmail.com',
  instruments: ['Sax', 'Piano'],
  role: 'admin',
};

describe('AppController (e2e)', () => {
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

  // TODO
  // general testing errors

  describe('/users - GET - POST - PUT - DELETE', () => {
    // store tne user id for the PUT
    let userIdToUpdate = '';

    // test the empty user db
    it(`GET > [] `, async () => {
      return await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([]);
    });

    // test create a user in db
    it('POST > 201 and user First name Last name and Email ', async () => {
      // request into var
      const req = await request(app.getHttpServer())
        .post('/users')
        .send(objPostUser)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      userIdToUpdate = req._id;

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUser.firstName);
      expect(req.lastName).toBe(objPostUser.lastName);
      expect(req.email).toBe(objPostUser.email);
    });

    it('PUT > 200 and user updated data', async () => {
      const req = await request(app.getHttpServer())
        .put(`/users/${userIdToUpdate}`)
        .send(objUpdateUser)
        .expect(200)
        .then((res) => JSON.parse(res.text));

      expect.assertions(4);

      // use returned values
      expect(req.firstName).toBe(objUpdateUser.firstName);
      expect(req.lastName).toBe(objUpdateUser.lastName);
      expect(req.email).toBe(objUpdateUser.email);
      expect(req.instruments[1]).toBe(objUpdateUser.instruments[1]);
    });

    it('GET - New all users db > length 1', async () => {
      const req = await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((res) => JSON.parse(res.text));

      // time for db update
      setTimeout(() => {
        expect.assertions(1);
        expect(req).toHaveLength(1);
      }, 2000);
    });
  });
});
