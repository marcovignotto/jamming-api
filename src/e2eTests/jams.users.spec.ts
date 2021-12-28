/**
* @desc all Jam's CRUD Flow
        the tests creates a full CRUD for the route /jams

        1. creates 5 users in /users 
        2. deletes 5 users in /users (default skip)

        thr sets can be skipped to check it one by one 

        IMPORTANT if the CRUD is not complete (jam or users deleted) 
        it throws errors, unless the db changed 
*/

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import {
  credentialBobDylan,
  credentialJohnColtrane,
  credentialJoniMitchell,
  credentialNeilYoung,
  credentialYokoOno,
  tokenBodDylan,
  tokenNeilYoung,
  tokenJohnColtrane,
  tokenJoniMitchell,
  tokenYokoOno,
} from './stubs/users.stubs';
import { jamOne } from './stubs/jams.stubs';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

const PATH_AUTH = API_VERSION + '/auth';
const PATH_JAMS = API_VERSION + '/jams';
const PATH_USERS = API_VERSION + '/users';

describe.skip('/jams POST - DELETE users', () => {
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
  // to create a jam we need a few users (players) with different instruments

  // players to create into array
  const arrayOfPlayers = [
    credentialBobDylan(),
    credentialJohnColtrane(),
    credentialJoniMitchell(),
    credentialNeilYoung(),
    credentialYokoOno(),
  ];

  // for the last part, user deletion
  let arrayOfIdsToDelete = [];

  // create the users

  describe('1. Create 5 users', () => {
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

  // delete the users
  // default skip
  describe.skip('2. Delete 5 users', () => {
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
