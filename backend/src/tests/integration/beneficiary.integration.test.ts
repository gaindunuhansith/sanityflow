import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('beneficiary integration tests', () => {
  let mongod: any;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();

    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  test('POST /api/v1/beneficiaries should create a beneficiary (admin)', async () => {
    const res = await request(app)
      .post('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'John', location: 'A', familySize: 5, contact: '123', eligibilityStatus: 'Active' })
      .expect(201);
    expect(res.body.name).toBe('John');
  });

  test('GET /api/v1/beneficiaries should list beneficiaries (admin)', async () => {
    await request(app)
      .post('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Jane', location: 'B', familySize: 3, contact: '456', eligibilityStatus: 'Active' })
      .expect(201);
    const res = await request(app)
      .get('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/beneficiaries/:id should get a beneficiary (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Family', location: 'C', familySize: 2, contact: '789', eligibilityStatus: 'Active' })
      .expect(201);
    const res = await request(app)
      .get('/api/v1/beneficiaries/' + createRes.body._id)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);
    expect(res.body.name).toBe('Family');
  });

  test('PUT /api/v1/beneficiaries/:id should update a beneficiary (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Test', location: 'D', familySize: 1, contact: '000', eligibilityStatus: 'Active' })
      .expect(201);
    const res = await request(app)
      .put('/api/v1/beneficiaries/' + createRes.body._id)
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ familySize: 6, eligibilityStatus: 'Inactive' })
      .expect(200);
    expect(res.body.familySize).toBe(6);
  });

  test('DELETE /api/v1/beneficiaries/:id should remove a beneficiary (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/beneficiaries')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Del', location: 'E', familySize: 1, contact: '111', eligibilityStatus: 'Active' })
      .expect(201);
    const res = await request(app)
      .delete('/api/v1/beneficiaries/' + createRes.body._id)
      .set('Authorization', 'Bearer ' + adminToken);
    expect([200, 204]).toContain(res.status);
    await request(app)
      .get('/api/v1/beneficiaries/' + createRes.body._id)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(404);
  });
});
