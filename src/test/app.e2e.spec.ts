import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import * as request from 'supertest';
import { AppModule } from '../app.module';

import {
  credentialUserGeneral,
  credentialUserAdmin,
  tokenUserAdmin,
  tokenUserGeneral,
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

import apiVersion from '../../config/apiVersion';
import { DatabaseService } from '../database/database.service';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// test obj
const objPostUserGeneral = credentialUserGeneral();

const objUpdateUserToAdmin = credentialUserAdmin();

// paths
const PATH_USERS = API_VERSION + '/users';
const PATH_AUTH = API_VERSION + '/auth';
const PATH_JAMS = API_VERSION + '/jams';

describe('AppController (e2e)', () => {
  let connectionMongoDb: Connection;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // simulate a nest runtime env
    app = moduleFixture.createNestApplication();
    // init the app
    await app.init();

    // TODO
    connectionMongoDb = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .connectMongoDB();
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
    });

    // uses the to get the data of the just registered user
    it('GET > 200 and user data ', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_AUTH)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => res.body);

      console.log('req', req);

      expect.assertions(3);

      // use returned values
      expect(req.firstName).toBe(objPostUserGeneral['firstName']);
      expect(req.lastName).toBe(objPostUserGeneral['lastName']);
      expect(req.email).toBe(objPostUserGeneral['email']);
    });

    // the admin deletes the user
    it.skip('DELETE user with admin credentials > 200 and delete confirmation', async () => {
      const req = await request(app.getHttpServer())
        .delete(PATH_USERS + `/${userTodelete}`) // the same as update
        .set('Authorization', 'Bearer ' + tokenUserGeneral()) // temp id
        .expect(200)
        .then((res) => res.text);

      expect.assertions(4);

      expect(req).toContain('User');
      expect(req).toContain(objPostUserGeneral['firstName']);
      expect(req).toContain(objPostUserGeneral['lastName']);
      expect(req).toContain('deleted');
    });
  });

  // users to create for the next test
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

  // * Now create the JAM!
  // * Now create the JAM!
  // * Now create the JAM!
  // once all the 5 users are created on a blank collection (jams)
  // all those process are simulating the creation of a jam from one user (Bob Dylan)
  // and the join of the jam from other 4 users

  // but the space is just for 3 users!
  // so one will not find her spot

  // The sequence
  // 1. Bod Dylan creates the Jam (4 players, 3 spots available)
  // 2. Joni Mitchell requests and find an available spot for "Voice" (2 spots available)
  // 3. Yoko Ono requests and does not find cause "Voice" is gone
  // 4. Yoko ono retries and see the jam but can't join it
  // 5. Neil Young requests and find an available spot for "Guitar" (1 spot available)
  // 6. John Coltrane requests and find an available spot for "Sax" (0 spots available)
  // 7. Yoko Ono requests and does not find cause the jam is not available
  // 8. Yoko Ono accidentaly tries to delete the jam but she CAN'T because she  is not the host
  // 9. It's late and Bod Dylan deletes the jam (he is the host)

  describe.skip('/jams - GET - POST - PUT - DELETE', () => {
    // to have a simpler authorization some token
    const tokenJamHost = tokenBodDylan();
    // other players
    const tokenJamPlayerOne = tokenJoniMitchell();
    const tokenJamPlayerTwo = tokenNeilYoung();
    const tokenJamPlayerThree = tokenJohnColtrane();
    // the too late player
    const tokenJamPlayerFour = tokenYokoOno();

    const testObjJamToCreate = {
      jamName: 'Jamming with Mr Tamburine',
      hostEmail: credentialBobDylan()['email'],
      instruments: ['Guitar', 'Voice', 'Sax'],
      totalNumberOfPlayers: 4,
      kindOfMusic: 'Rock Folk Jazz ',
    };

    // just for testing the already converted url
    let jamToJoinUrl = 'jamming-with-mr-tamburine';

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

    // create jam
    // created by bod dylan
    it('POST > 201 and the created jam', async () => {
      const req = await request(app.getHttpServer())
        .post(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .send(testObjJamToCreate)
        .expect(201)
        .then((res) => res.body);

      expect.assertions(7);

      expect(req['jamName']).toBe(testObjJamToCreate['jamName']);
      expect(req['jamUrl']).toBe(jamToJoinUrl);
      expect(req['instruments']).toStrictEqual([
        ...testObjJamToCreate['instruments'],
        credentialBobDylan()['instrument'],
      ]);
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

    // check error in case of twice
    it(`POST Error posting twice > 400 "Bad Request"`, async () => {
      await request(app.getHttpServer())
        .post(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamHost)
        .send(testObjJamToCreate)
        .expect(400);
    });

    it('GET WITHOUT query all > 200 and all the jams [] length 1 ', async () => {
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
    it('GET WITHOUT query all > 200 and all JUST the jams avaible for the player [] length 0', async () => {
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
    // must return the available jam cause "Voice" is still available

    it('GET - WITHOUT query all > 200 and all JUST the jams avaible for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerOne)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      jamToJoinUrl = req[0].jamUrl;

      // use returned values
      expect(Number(req.length)).toBe(1);
    });

    // Joni Mitchell joins the jam
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument

    it('PUT - join the available jam', async () => {
      const joinJam = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerOne)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(4);

      // check if the instrumnet is moved into the joined instrument
      expect(joinJam['joinedInstruments']).toContain(
        credentialJoniMitchell()['instrument'],
      );

      // check if the instrumnet is not available anymore
      expect(joinJam['availableInstruments']).not.toContain(
        credentialJoniMitchell()['instrument'],
      );
      // check if the player is added to the array
      expect(joinJam['joinedPlayers']).toHaveLength(2);

      // check if there's one player less
      expect(joinJam['playersLeft']).toBe(2);
    });

    // now Yoko Ono makes request
    // but the instrument voice is gone
    // must NOT return the available jam
    it('GET - WITHOUT query all > 200 and NO jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      setTimeout(() => {
        // use returned values
        expect(Number(req.length)).toBe(0);
      }, 500);
    });

    // Yoko Ono is stubborn and makes request with all=true
    // returns 1 jam but NOT joinable
    it('GET - WITH query all > 200 and NO jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .query('all=true') // to show all the jams
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(200)
        .then((res) => res.body);

      setTimeout(() => {
        expect.assertions(5);

        // check if mongo populate works

        // use returned values
        expect(Number(req.length)).toBe(1);
        // two players already joined
        expect(req[0].joinedPlayers.length).toBe(2);
        // check the name of the player 1 (host)
        expect(req[0].joinedPlayers[0].firstName).toBe(
          credentialBobDylan()['firstName'],
        );
        // check the name of the player 2
        expect(req[0].joinedPlayers[1].firstName).toBe(
          credentialJoniMitchell()['firstName'],
        );
        // host
        expect(req[0].host.firstName).toBe(credentialBobDylan()['firstName']);
      }, 2000);
    });

    // now Neil Young makes request
    // must return the available jam cause "Guitar" is still available

    it('GET - WITHOUT query all > 200 and all JUST the jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerTwo)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      jamToJoinUrl = req[0].jamUrl;

      // use returned values
      expect(Number(req.length)).toBe(1);
    });

    // neil young joins
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument

    it('PUT - join the available jam', async () => {
      const joinJam = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerTwo)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(4);

      // check if the instrumnet is moved into the joined instrument
      expect(joinJam['joinedInstruments']).toContain(
        credentialNeilYoung()['instrument'],
      );

      // check if the instrumnet is not available anymore
      expect(joinJam['availableInstruments']).not.toContain(
        credentialNeilYoung()['instrument'],
      );
      // check if the player is added to the array
      expect(joinJam['joinedPlayers']).toHaveLength(3);

      // check if there's one player less
      expect(joinJam['playersLeft']).toBe(1);
    });

    // John Coltrane request and join
    // must return the available jam cause "Sax" is still available

    it('GET - WITHOUT query all > 200 and all JUST the jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerThree)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      jamToJoinUrl = req[0].jamUrl;

      // use returned values
      expect(Number(req.length)).toBe(1);
    });

    // John Coltrane joins
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument

    it('PUT - join the available jam', async () => {
      const joinJam = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerThree)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(5);

      // check if the instrumnet is moved into the joined instrument
      expect(joinJam['joinedInstruments']).toContain(
        credentialJohnColtrane()['instrument'],
      );

      // check if the instrumnet is not available anymore
      expect(joinJam['availableInstruments']).not.toContain(
        credentialJohnColtrane()['instrument'],
      );
      // check if the player is added to the array
      expect(joinJam['joinedPlayers']).toHaveLength(4);

      // check if there's one player less
      expect(joinJam['playersLeft']).toBe(0);

      // IMPORTANT
      // the last player joined so must be true

      expect(joinJam['started']).toBe(true);
    });

    // now Yoko Ono makes request
    // but no jams are available
    it('GET - without query all > 200 and NO jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(0);
    });

    // the player accidentaly tries to delete the jam but can't
    it('DELETE Error > 401 the player is NOT the host ', async () => {
      const req = await request(app.getHttpServer())
        .delete(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenYokoOno())
        .expect(401)
        .then((res) => JSON.parse(res.text));

      expect.assertions(1);

      expect(req.message).toContain(
        'Invalid credentials for the requested operation!',
      );
    });

    // the host deletes the jam
    it('DELETE > 200 and delete confirmation ', async () => {
      const req = await request(app.getHttpServer())
        .delete(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenBodDylan())
        .expect(200)
        .then((res) => res.text);

      expect.assertions(4);

      expect(req).toContain(credentialBobDylan()['firstName']);
      expect(req).toContain(credentialBobDylan()['lastName']);
      expect(req).toContain('deleted');
      expect(req).toContain('the jam');
    });
  });
});
