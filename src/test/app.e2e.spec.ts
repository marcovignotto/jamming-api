import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as request from 'supertest';
import { AppModule } from '../app.module';

const objPostUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
  instruments: ['Sax', 'Drum'],
  role: 'player',
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
    // test the empty user db
    it(`GET > [] `, async () => {
      return await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([]);
    });

    // test create a user in db
    it('POST > 200 and user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(objPostUser)
        .expect(200);
      // .expect({});
    });
  });
});
