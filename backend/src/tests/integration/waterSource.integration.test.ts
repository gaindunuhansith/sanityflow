import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('waterSource integration tests', () => {
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
    
    // Register normal user
    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;

    // Create an admin by manually inserting to DB since /create-admin requires an existing admin token
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    // login to get token
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  test('POST /api/v1/water-sources should create a new source (admin)', async () => {
    const payload = {
      name: 'Central Well',
      type: 'well',
      location: '12.34, 56.78',
      capacity: 5000,
      condition: 'Good'
    };

    const res = await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Central Well');
    expect(res.body.type).toBe('well');
  });

  test('POST /api/v1/water-sources should fail for standard user', async () => {
    const payload = { name: 'User Well', type: 'well', location: 'loc', capacity: 100 };
    await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload)
      .expect(403);
  });

  test('GET /api/v1/water-sources retrieves all active resources', async () => {
    const payload = { name: 'Lake Source', type: 'borehole', location: 'loc', capacity: 100, isActive: true, condition: 'Fair' };
    await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    const res = await request(app)
      .get('/api/v1/water-sources')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].name).toBe('Lake Source');
  });

  test('GET /api/v1/water-sources/:id retrieves a single source', async () => {
    const createRes = await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Specific Source', type: 'tap', location: 'City Center', capacity: 200 })
      .expect(201);

    const id = createRes.body._id;

    const res = await request(app)
      .get(`/api/v1/water-sources/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(res.body._id).toBe(id);
    expect(res.body.name).toBe('Specific Source');
  });

  test('PUT /api/v1/water-sources/:id updates a source (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Old Name', type: 'tap', location: 'loc', capacity: 100 })
      .expect(201);

    const id = createRes.body._id;

    const res = await request(app)
      .put(`/api/v1/water-sources/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name', condition: 'Poor' })
      .expect(200);

    expect(res.body.name).toBe('Updated Name');
    expect(res.body.condition).toBe('Poor');
  });

  test('DELETE /api/v1/water-sources/:id deletes a source', async () => {
    const createRes = await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'To Be Deleted', type: 'well', location: 'loc', capacity: 100 })
      .expect(201);

    const id = createRes.body._id;

    await request(app)
      .delete(`/api/v1/water-sources/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app)
      .get(`/api/v1/water-sources/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});