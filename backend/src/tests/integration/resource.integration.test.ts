import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('resource integration tests', () => {
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

  const dummySupplierId = '601f70500f402f00155b42ab';

  test('POST /api/v1/resources should create a resource', async () => {
    const res = await request(app)
      .post('/api/v1/resources')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Water Filter', category: 'Equipment', quantity: 50, unit: 'pcs', supplier: dummySupplierId, reorderLevel: 5 })
      .expect(201);
    expect(res.body.name).toBe('Water Filter');
  });

  test('GET /api/v1/resources should list resources', async () => {
    await request(app).post('/api/v1/resources').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Chlorine', category: 'Chemicals', quantity: 200, unit: 'kg', supplier: dummySupplierId }).expect(201);
    const res = await request(app).get('/api/v1/resources').set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/resources/:id should get a resource', async () => {
    const createRes = await request(app).post('/api/v1/resources').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Pipes', category: 'Hardware', quantity: 100, unit: 'm', supplier: dummySupplierId }).expect(201);
    const res = await request(app).get('/api/v1/resources/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.name).toBe('Pipes');
  });

  test('PUT /api/v1/resources/:id should update a resource', async () => {
    const createRes = await request(app).post('/api/v1/resources').set('Authorization', 'Bearer ' + adminToken).send({ name: 'TestRes', category: 'Misc', quantity: 10, unit: 'item', supplier: dummySupplierId }).expect(201);
    const res = await request(app).put('/api/v1/resources/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).send({ quantity: 20 }).expect(200);
    expect(res.body.quantity).toBe(20);
  });

  test('DELETE /api/v1/resources/:id should remove a resource', async () => {
    const createRes = await request(app).post('/api/v1/resources').set('Authorization', 'Bearer ' + adminToken).send({ name: 'DelRes', category: 'Misc', quantity: 5, unit: 'item', supplier: dummySupplierId }).expect(201);
    const res = await request(app).delete('/api/v1/resources/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(204);
    await request(app).get('/api/v1/resources/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(404);
  });
});
