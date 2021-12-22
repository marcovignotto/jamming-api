// import { Test, TestingModule } from '@nestjs/testing';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users/users.service';
// import { AuthService } from './auth/auth.service';
// import { JamsService } from './jams/jams.service';

// describe('AppController', () => {
//   let appController: AppController;
//   let usersService: UsersService;
//   let authService: AuthService;
//   let jamsService: JamsService;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       // imports: [
//       //   MongooseModule.forRootAsync({
//       //     imports: [ConfigModule],
//       //     useFactory: async (configService: ConfigService) => ({
//       //       // uri: configService.get<string>('MONGODB_URI'),
//       //       uri: process.env.MONGODB_URI,
//       //     }),
//       //     inject: [ConfigService],
//       //   }),
//       // ],
//       imports: [ConfigModule],
//       controllers: [AppController],
//       providers: [AppService, UsersService, AuthService, JamsService],
//     }).compile();

//     appController = app.get<AppController>(AppController);
//     usersService = app.get<UsersService>(UsersService);
//     authService = app.get<AuthService>(AuthService);
//     jamsService = app.get<JamsService>(JamsService);
//   });

//   describe('root', () => {
//     it('should return "Hello World!"', () => {
//       expect(appController.getHello()).toBe('Hello World!');
//     });
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'mongoose';

import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;
  let connection: Connection;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(process.env.MONGODB_URI)],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);

    // mongoose connection
    connection = await app.get(getConnectionToken());
  });

  describe('root', () => {
    it.skip('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  // close connection
  afterAll(async () => {
    await connection.close(/*force:*/ true);
  });
});
