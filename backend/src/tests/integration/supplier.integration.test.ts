import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('supplier integration tests', () => {
  let mongod: any;
  let adminToken: string;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
    await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
    const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  test('POST /api/v1/suppliers should create a supplier', async () => {
    const res = await request(app)
      .post('/api/v1/suppliers')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Acme Corp', contact: { email: 'contact@acme.com', phone: '123' }, reliabilityRating: 4 })
      .expect(201);
    expect(res.body.name).toBe('Acme Corp');
  });

  test('GET /api/v1/suppliers should list suppliers', async () => {
    await request(app).post('/api/v1/suppliers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Beta Corp', contact: {} }).expect(201);
    const res = await request(app).get('/api/v1/suppliers').set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/suppliers/:id should get a supplier', async () => {
    const createRes = await request(app).post('/api/v1/suppliers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Charlie Co', contact: {} }).expect(201);
    const res = await request(app).get('/api/v1/suppliers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.name).toBe('Charlie Co');
  });

  test('PUT /api/v1/suppliers/:id should update a supplier', async () => {
    const createRes = await request(app).post('/api/v1/suppliers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Delta', contact: {} }).expect(201);
    const res = await request(app).put('/api/v1/suppliers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).send({ reliabilityRating: 5 }).expect(200);
    expect(res.body.reliabilityRating).toBe(5);
  });

  test('DELETE /api/v1/suppliers/:id should remove a supplier', async () => {
    const createRes = await request(app).post('/api/v1/suppliers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Echo', contact: {} }).expect(201);
    const res = await request(app).delete('/api/v1/suppliers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(204);
    await request(app).get('/api/v1/suppliers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(404);
  });
});
