import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter.js';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor.js';
import { GLOBAL_PREFIX } from '../src/common/constants/app.constants.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(GLOBAL_PREFIX);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  it('/api (GET) responde con el envelope estándar', async () => {
    const response = await request(app.getHttpServer()).get('/api').expect(200);

    expect(response.body).toHaveProperty('statusCode', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('/api/companies (GET) responde paginado', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/companies')
      .expect(200);

    expect(response.body.data).toHaveProperty('items');
    expect(response.body.data).toHaveProperty('meta');
  });

  afterEach(async () => {
    await app.close();
  });
});
