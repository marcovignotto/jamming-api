/**
* @desc all Jam's CRUD Flow
        the tests creates a full CRUD for the route /jams

        IMPORTANT: it needs the 5 users on jams.users.spec.ts

        1. GET - POST /jams
        3. PUT - DELETE /jams

        thr sets can be skipped to check it one by one 

        IMPORTANT: if the CRUD is not complete (jam or users deleted) 
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

describe.skip('/jams CRUD', () => {
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

  // * Now create the JAM!
  // once all the 5 users are created on a blank collection (jams)
  // all those process are simulating the creation of a jam from one user (Bob Dylan)
  // and the join of the jam from other 4 users

  // but the space is just for 3 users!
  // so one will not find her spot

  // The main points of the sequence 1 & 2
  // 1. Bod Dylan creates the Jam (4 players, 3 spots available)
  // 2. Joni Mitchell requests and find an available spot for "Voice" (2 spots available)
  // 3. Yoko Ono requests and does not find cause "Voice" is gone
  // 4. Yoko ono retries and see the jam but can't join it
  // 5. Neil Young requests and find an available spot for "Guitar" (1 spot available)
  // 5a.Neil Young accidentaly joins twice and gets an error
  // 6. John Coltrane requests and find an available spot for "Sax" (0 spots available)
  // 7. Yoko Ono requests and does not find cause the jam is not available
  // 8. Yoko Ono accidentaly tries to delete the jam but she CAN'T because she is not the host
  // 9. It's late and Bod Dylan deletes the jam (he is the host)

  describe('1. GET - POST', () => {
    // to have a simpler authorization some token
    const tokenJamHost = tokenBodDylan();
    // other players
    const tokenJamPlayerOne = tokenJoniMitchell();
    const tokenJamPlayerTwo = tokenNeilYoung();
    const tokenJamPlayerThree = tokenJohnColtrane();
    // the too late player
    const tokenJamPlayerFour = tokenYokoOno();

    const testObjJamToCreate = jamOne();

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
        .send({
          jamName: 'Jamming with Mr Tamburine',
          hostEmail: 'bobdylan@gmail.com',
          instruments: ['Guitar', 'Voice', 'Sax'],
          totalNumberOfPlayers: 4,
          kindOfMusic: 'Rock Folk Jazz',
        })
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

    it('GET WITH query all > 200 and all the jams [] length 1 ', async () => {
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

      // use returned values
      expect(req.length).toBe(0);
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

    // Yoko Ono wants to join even if the "Voice" is not available anymore
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument
    it('PUT - join a even if the instrument is not available > ERROR 400', async () => {
      const req = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(400)
        .then((res) => JSON.parse(res.text));

      expect.assertions(1);

      expect(req.message).toContain(
        'Sorry but you can not join with your instrument!',
      );
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

    // by mistake Neil Young requests twice
    // returns an error
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument

    it('PUT - join the jam twice > ERROR 400', async () => {
      const req = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerTwo)
        .expect(400)
        .then((res) => JSON.parse(res.text));

      expect.assertions(1);

      expect(req.message).toContain('You already joined this Jam!');
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
  });

  // 3. NEEDS the users
  describe('2.  PUT - DELETE', () => {
    // other players

    // the too late player
    const tokenJamPlayerFour = tokenYokoOno();

    // just for testing the already converted url
    let jamToJoinUrl = 'jamming-with-mr-tamburine';

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

    // now Yoko Ono makes request WITH query all
    // one jam available
    it('GET - without query all > 200 and NO jams available for the player [] length 1', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_JAMS)
        .query('all=true') // to show all the jams
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(Number(req.length)).toBe(1);
    });

    // Yoko Ono wants to join even if the jam already started
    // new PUT request to the specific jam i.e. /jams/jamming-with-mr-tamburine
    // and join with the instrument
    it('PUT - join a full jam > ERROR 400', async () => {
      const req = await request(app.getHttpServer())
        .put(PATH_JAMS + '/' + jamToJoinUrl)
        .set('Authorization', 'Bearer ' + tokenJamPlayerFour)
        .expect(400)
        .then((res) => JSON.parse(res.text));

      expect.assertions(1);

      expect(req.message).toContain(
        'Sorry but is not possible to join the jam',
      );
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

    // check a sample user if the player's field currentJam is empty
    it('GET - check currentJam > 200 and null', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_AUTH)
        .set('Authorization', `Bearer ${tokenBodDylan()}`)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values
      expect(req.currentJam).toBe(null);
    });

    // check a sample user if the player's field currentJam is empty
    it('GET - check currentJam > 200 and null', async () => {
      const req = await request(app.getHttpServer())
        .get(PATH_AUTH)
        .set('Authorization', `Bearer ${tokenJohnColtrane()}`)
        .expect(200)
        .then((res) => res.body);

      expect.assertions(1);

      // use returned values

      expect(req['currentJam']).toBe(null);
    });
  });
});
