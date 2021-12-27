/**
 * @desc the test creates the 5 users for the jam CRUD flow
 *       db must be empty
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import {
  credentialBobDylan,
  tokenBodDylan,
  credentialJohnColtrane,
  tokenJohnColtrane,
  credentialJoniMitchell,
  tokenJoniMitchell,
  credentialNeilYoung,
  tokenNeilYoung,
  credentialYokoOno,
  tokenYokoOno,
} from './stubs/users.stubs';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// paths
const PATH_USERS = API_VERSION + '/users';

describe('/jams CRUD 001', () => {
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

  // users to create for Jam CRUD test
  // db must be empty
  // to create a jam we need a few users (players) with diffrerent instruments
  // one creates the jam for 4 players  in total and other 3 join
  // one arrives late and can't join

  // players to create into array
  const arrayOfPlayers = [
    credentialBobDylan(),
    credentialJohnColtrane(),
    credentialJoniMitchell(),
    credentialNeilYoung(),
    credentialYokoOno(),
  ];

  let arrayOfIdsToDelete = [];

  describe('Create users for the /jams test', () => {
    // loop to create
    for (let i = 0; i < arrayOfPlayers.length; i++) {
      const player = arrayOfPlayers[i];

      it(`Create player ${player['firstName']} ${player['lastName']} with ${player['instrument']} `, async () => {
        const req = await request(app.getHttpServer())
          .post(PATH_USERS)
          .send(player)
          .expect(201)
          .then((res) => JSON.parse(res.text));

        arrayOfIdsToDelete.push(req['_id']);

        expect.assertions(3);

        // use returned values
        expect(req['firstName']).toBe(player['firstName']);
        expect(req['lastName']).toBe(player['lastName']);
        expect(req['email']).toBe(player['email']);
      });
    }
  });

  describe('Delete users for the /jams test', () => {
    // tokens to loop
    const arrayOfToken = [
      tokenBodDylan(),
      tokenJohnColtrane(),
      tokenJoniMitchell(),
      tokenNeilYoung(),
      tokenYokoOno(),
    ];

    // loop to create
    for (let i = 0; i < arrayOfPlayers.length; i++) {
      const player = arrayOfPlayers[i];

      it(`Delete player ${player['firstName']} ${player['lastName']}`, async () => {
        const req = await request(app.getHttpServer())
          .delete(PATH_USERS + `/${arrayOfIdsToDelete[i]}`) // the same as update
          .set('Authorization', 'Bearer ' + arrayOfToken[i]) // temp id
          .expect(200)
          .then((res) => res.text);

        expect.assertions(4);

        expect(req).toContain('User');
        expect(req).toContain(player['firstName']);
        expect(req).toContain(player['lastName']);
        expect(req).toContain('deleted');
      });
    }
  });
});
