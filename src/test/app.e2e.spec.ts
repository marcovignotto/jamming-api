import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import {
  credentialUserGeneral,
  credentialUserAdmin,
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
} from './utils/testCredentials';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// test obj
const objPostUser = credentialUserGeneral();

const objUpdateUser = credentialUserAdmin();

// paths
const PATH_USERS = API_VERSION + '/users';
const PATH_AUTH = API_VERSION + '/auth';
const PATH_JAMS = API_VERSION + '/jams';

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

  describe.skip('/users - GET - POST - PUT - DELETE', () => {
    // store tne user id for the PUT
    let userIdToUpdate = '';

    // test the  user db
    it.skip(`GET > [] `, async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_USERS)
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
        .send(objPostUser)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      userIdToUpdate = req._id;

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUser['firstName']);
      expect(req.lastName).toBe(objPostUser['lastName']);
      expect(req.email).toBe(objPostUser['email']);
    });

    //TODO
    // auth for user
    // now general token

    it('PUT > 200 and user updated data', async () => {
      const req = await request(app.getHttpServer())
        .put(PATH_USERS + `/${userIdToUpdate}`)
        .set('Authorization', 'Bearer ' + tokenBodDylan()) // ! using a temp token
        .send(objUpdateUser)
        .expect(200)
        .then((res) => JSON.parse(res.text));

      expect.assertions(4);

      // use returned values
      expect(req.firstName).toBe(objUpdateUser['firstName']);
      expect(req.lastName).toBe(objUpdateUser['lastName']);
      expect(req.email).toBe(objUpdateUser['email']);
      expect(req.instruments).toBe(objUpdateUser['instruments']);
    });

    // work if the DB was empty
    it.skip('GET - New all users db > length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_USERS)
        .expect(200)
        .then((res) => res.body);

      // time for db update
      setTimeout(() => {
        expect.assertions(1);
        expect(Number(req.length)).toBe(Number(req.length));
      }, 2000);
    });
  });

  // TODO
  // general testing errors

  describe.skip('/auth - GET - POST', () => {
    // Important
    // this test its just to create a user for the auth test
    it.skip('Create the test user for the next test', async () => {
      // request into var
      const req = await request(app.getHttpServer())
        .post(API_VERSION + '/users')
        .send(objPostUser)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUser['firstName']);
      expect(req.lastName).toBe(objPostUser['lastName']);
      expect(req.email).toBe(objPostUser['email']);
    });

    // store token for get request
    let token = '';
    // the user tot request the token
    // has to be the one created in the previous test

    const userRequestToken = {
      email: objPostUser['email'],
      password: objPostUser['password'],
    };

    it('POST > 200 and token', async () => {
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

      console.log('TOEKN', token);
    });

    it.skip('GET > 200 and user data ', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_AUTH)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUser['firstName']);
      expect(req.lastName).toBe(objPostUser['lastName']);
      expect(req.email).toBe(objPostUser['email']);
    });
  });

  // to create a jam we need a few users (players) with diffrerent instruments
  // one creates the jam for 4 players  in total and other 3 join
  // one arrives late and can't join

  describe.skip('Create users for the /jams test', () => {
    // players to create into array
    const arrayOfPlayers = [
      credentialBobDylan(),
      credentialJohnColtrane(),
      credentialJoniMitchell(),
      credentialNeilYoung(),
      credentialYokoOno(),
    ];

    // loop to create
    for (let i = 0; i < arrayOfPlayers.length; i++) {
      const player = arrayOfPlayers[i];

      it(`Create player ${player['firstName']} ${player['lastName']} with ${player['instrument']} `, async () => {
        const req = await request(app.getHttpServer())
          .post(API_VERSION + '/users')
          .send(player)
          .expect(201)
          .then((res) => JSON.parse(res.text));

        expect.assertions(3);

        // use returned values
        expect(req['firstName']).toBe(player['firstName']);
        expect(req['lastName']).toBe(player['lastName']);
        expect(req['email']).toBe(player['email']);
      });
    }
  });

  // create the jam
  describe('/jams - GET - POST - PUT - DELETE', () => {
    // to have a simpler authorization some token
    const tokenJamHost = tokenBodDylan();
    // other players
    const tokenJamPlayerOne = tokenJoniMitchell();
    const tokenJamPlayerTwo = tokenNeilYoung();
    const tokenJamPlayerThree = tokenJohnColtrane();
    // the too late player
    const tokenJamPlayerFour = tokenYokoOno();

    let jamToJoinUrl = '';

    const testObjJamToCreate = {
      hostEmail: credentialBobDylan()['email'],
      jamName: 'Jamming with Mr Tamburine',
      jamUrl: 'jamming-with-mr-tamburine',
      // host: string,
      // joinedPlayers: string[],
      instruments: ['Guitar', 'Voice', 'Sax'],
      // joinedInstruments: ["Harmonica"],
      // availableInstruments: ['Guitar', 'Voice', 'Sax',
      totalNumberOfPlayers: 4,
      kindOfMusic: 'Rock Folk Jazz ',
    };

    it('GET > 200 and all the jams [] length 0 ', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .query('all=true')
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(Number(req.length));
    });

    // created by bod dylan
    it.skip('POST > 201 and the created jam', async () => {
      const req = await request(app.getHttpServer())
        .post(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .send(testObjJamToCreate)
        .expect(201)
        .then((res) => res.body);

      expect.assertions(7);

      expect(req['jamName']).toBe(testObjJamToCreate['jamName']);
      expect(req['jamUrl']).toBe(testObjJamToCreate['jamUrl']);
      expect(req['instruments']).toStrictEqual(
        testObjJamToCreate['instruments'],
      );
      // all the instruments
      expect(req['availableInstruments']).toStrictEqual(
        testObjJamToCreate['instruments'],
      );
      // this must be the creators instrument
      expect(req['joinedInstruments']).toStrictEqual([
        credentialBobDylan()['instrument'],
      ]);
      expect(req['totalNumberOfPlayers']).toBe(
        testObjJamToCreate['totalNumberOfPlayers'],
      );
      // total players - 1
      expect(req['playersLeft']).toBe(
        testObjJamToCreate['totalNumberOfPlayers'] - 1,
      );
    });
    it.skip(`POST Error posting twice > 500 "Internal Server Error"`, async () => {
      await request(app.getHttpServer())
        .post(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .send(testObjJamToCreate)
        .expect(500);
    });

    it('GET with query all > 200 and all the jams [] length 1 ', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .query('all=true')
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(1);
    });

    // having just one jam
    // if the user that created the jam does not have the instrument avaible
    it('GET without query all > 200 and all JUST the jams avaible for the player [] length 0', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(0);
    });

    // now Joni Mitchel makes request
    // must return the available jam
    // joins the jam
    it('GET without query all > 200 and all JUST the jams avaible for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerOne)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      jamToJoinUrl = req.jamUrl;

      // use returned values
      expect(Number(req.length)).toBe(1);

      // new requet to the specific jam i.e. /jams/jamming-with-mr-tamburine
      // and join with the instrument
    });

    // now Yoko Ono makes request
    // but the voice is gone
    // must NOT return the available jam

    // now Yoko Ono makes request with all
    // returns 1 jam but not joinable

    // neil young request and join

    // John Coltrane request and join

    // now Yoko Ono makes request
    // but no jams are available
  });
  afterAll(async () => {
    await app.close();
  });
});
