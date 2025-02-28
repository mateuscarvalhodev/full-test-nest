import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  let clientId: number;
  let userId = 1;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/clients (POST) - Criar um cliente', async () => {
    const response = await request(app.getHttpServer())
      .post('/clients')
      .send({
        name: 'Teste Cliente',
        salary: 5000,
        enterprisePrice: 50000,
        userId: userId,
      })
      .expect(201);

    clientId = response.body.id;
    expect(response.body).toMatchObject({
      name: 'Teste Cliente',
      salary: 5000,
      enterprisePrice: 50000,
      userId: userId,
    });
  });

  it('/clients (GET) - Buscar clientes pelo userId', async () => {
    const response = await request(app.getHttpServer())
      .get(`/clients?userId=${userId}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/clients/:id (PATCH) - Atualizar um cliente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/clients/${clientId}`)
      .send({ name: 'Cliente Atualizado' })
      .expect(200);

    expect(response.body.name).toBe('Cliente Atualizado');
  });

  it('/clients/:id/addToSelected (PATCH) - Adicionar cliente aos selecionados', async () => {
    await request(app.getHttpServer())
      .patch(`/clients/${clientId}/addToSelected`)
      .expect(200);
  });

  it('/clients/:id/removeFromSelected (PATCH) - Remover cliente dos selecionados', async () => {
    await request(app.getHttpServer())
      .patch(`/clients/${clientId}/removeFromSelected`)
      .expect(200);
  });

  it('/clients/:id (DELETE) - Deletar um cliente', async () => {
    await request(app.getHttpServer())
      .delete(`/clients/${clientId}`)
      .expect(200);
  });
});
