import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { getQueueToken } from '@nestjs/bullmq';
import { ERP_QUEUE } from '../src/erp-sync/erp-sync.module';
import { ZettiClient } from '../src/erp-sync/zetti.client';

describe('ERP Sync enqueue E2E', () => {
  let app: INestApplication;
  const addMock = jest.fn().mockResolvedValue({ id: 'job-1' });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      // Mock queue to avoid Redis in e2e
      .overrideProvider(getQueueToken(ERP_QUEUE))
      .useValue({ add: addMock })
      // Mock Zetti client to avoid external HTTP
      .overrideProvider(ZettiClient)
      .useValue({ about: async () => ({ version: 'demo' }), userPermissions: async () => ({ permissions: ['READ'] }) })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /erp/sync/products enqueues full', async () => {
    await request(app.getHttpServer())
      .post('/erp/sync/products')
      .send({ mode: 'full', groups: [2] })
      .expect(201)
      .expect(({ body }) => expect(body.enqueued).toBe(true));
    expect(addMock).toHaveBeenCalledWith(
      'sync:full',
      expect.objectContaining({ mode: 'full', groups: expect.any(Array) }),
      expect.objectContaining({ attempts: 5 })
    );
  });
});


