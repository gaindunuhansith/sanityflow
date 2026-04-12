import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';

describe('Auth integration tests', () => {
  let mongod: any;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('POST /api/v1/auth/register creates a user and returns token', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const res = await request(app).post('/api/v1/auth/register').send(payload).expect(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(payload.email);
  });

  test('POST /api/v1/auth/login logs in an existing user', async () => {
    const payload = { name: 'Login User', email: 'login@example.com', password: 'password123' };
    await request(app).post('/api/v1/auth/register').send(payload).expect(201);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: payload.email, password: payload.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(payload.email);
  });

  test('POST /api/v1/auth/register duplicate email returns 409', async () => {
    const payload = { name: 'Dup User', email: 'dup@example.com', password: 'password123' };
    await request(app).post('/api/v1/auth/register').send(payload).expect(201);
    await request(app).post('/api/v1/auth/register').send(payload).expect(409);
  });
});
