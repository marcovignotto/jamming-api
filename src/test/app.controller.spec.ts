import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

// mock service
jest.mock('../app.service.ts');

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    //
    let welcomeMsg;

    // call the ctrl
    beforeEach(async () => {
      welcomeMsg = await appController.getHello();
    });

    it('should be called', () => {
      expect(appService.getHello).toBeCalled();
    });

    it('should return "Welcome message', () => {
      expect(welcomeMsg).toEqual(
        'Welcome to the *** jamming API ***. See how it works: <a href="http://localhost:5000/api-docs/">http://localhost:5000/api-docs/</a>',
      );
    });
  });
});
