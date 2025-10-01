import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';

describe('ERP Sync E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/erp/health', async () => {
    // Nota: about() real requiere remoto; aquí validamos 200 aunque sea stub-mock si se provee
    await request(app.getHttpServer()).get('/erp/health').expect(200);
  });
});


