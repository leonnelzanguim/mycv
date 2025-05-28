import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('/auth/signup (POST) - success', async () => {
    const email = 'fhbwhfbewbf@fkmkewmf.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'mypassword' })
      .expect(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toEqual(email);
  });

  afterAll(async () => {
    await app.close();
  });
});
