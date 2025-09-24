import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'e2e@example.com', password: 'secret123' })
      .expect(201);
    expect(res.body.ok).toBe(true);
  });

  it('/auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'e2e@example.com', password: 'secret123' })
      .expect(201);
    expect(res.body.token).toBeDefined();
  });
});


