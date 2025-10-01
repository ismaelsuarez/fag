import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { ZettiClient } from '../src/erp-sync/zetti.client';

describe('ERP Permissions E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ZettiClient)
      .useValue({ userPermissions: async () => ({ permissions: ['READ'] }), about: async () => ({ version: 'demo' }) })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/erp/permissions/:nodeId', async () => {
    const res = await request(app.getHttpServer()).get('/erp/permissions/123').expect(200);
    expect(res.body.permissions).toContain('READ');
  });
});


