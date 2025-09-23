import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../src/presentation/http/app.controller';
import { AppService } from '../src/services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return hello', () => {
    expect(appController.getHello()).toEqual({ message: 'Hola desde API' });
  });
});


