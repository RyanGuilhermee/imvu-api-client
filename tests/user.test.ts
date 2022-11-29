import request, { Response } from 'supertest';
import { SetupServer } from '@src/index';
import { PrismaClient } from '@prisma/client';

beforeAll(async () => {
  const setupServer: SetupServer = new SetupServer();
  setupServer.init();

  global.globalRequest = request(setupServer.app);
});

afterAll(async () => {
  try {
    const prismaClient = new PrismaClient();
    await prismaClient.user.delete({
      where: {
        email: 'test@gmail.com'
      }
    });
  } catch (error) {
    console.log(error);
  }
});

describe('User route', () => {
  it('should create a user', async () => {
    const response = await global.globalRequest.post('/user/create').send({
      name: 'test1',
      email: 'test@gmail.com',
      password: '123'
    });

    expect(response.status).toBe(200);
  });

  it('should return a user', async () => {
    const response: Response = await global.globalRequest.get('/').send({
      id: 1
    });

    expect(response.status).toBe(200);
  });
});
