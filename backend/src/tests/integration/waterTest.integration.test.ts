import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('waterTest integration tests', () => {
  let mongod: any;
  let adminToken: string;
  let userToken: string;
  let sourceId: string;
  let testerId: string;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    const user = await User.create({
      name: 'Tester',
      email: 'user@example.com',
      password: 'password123',
      role: 'member'
    });
    testerId = String(user._id);

    const userRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
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

    // We must have a water source created to attach tests to
    const sourceRes = await request(app)
      .post('/api/v1/water-sources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'River', type: 'borehole', location: 'X', capacity: 100 });
    sourceId = sourceRes.body._id;
  });

  test('POST /api/v1/water-tests should create a test (admin)', async () => {
    const payload = {
      waterSource: sourceId,
      pH: 7.2,
      tds: 300,
      turbidity: 2.5,
      contaminants: ['Lead'],
      status: 'Safe' // tester is automatically taken from the token
    };

    const res = await request(app)
      .post('/api/v1/water-tests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    expect(res.body.pH).toBe(7.2);
    // the tester property is expected to be populated or match the admin ID
    const returnedTester = typeof res.body.tester === 'object' ? res.body.tester._id : res.body.tester;
    // admin ID will be set by backend based on token
    expect(returnedTester).toBeDefined();
    expect(res.body.waterSource).toBe(sourceId);
  });

  test('GET /api/v1/water-tests should list active tests', async () => {
    // Create one test
    await request(app)
      .post('/api/v1/water-tests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        waterSource: sourceId,
        pH: 6.8,
        tds: 400,
        turbidity: 1.0,
        contaminants: [],
        status: 'Safe',
        tester: testerId
      })
      .expect(201);

    const res = await request(app)
      .get('/api/v1/water-tests')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].pH).toBe(6.8);
  });

  test('GET /api/v1/water-tests/analytics should return calculated stats', async () => {
    // Create one test so there is data to aggregate
    await request(app)
      .post('/api/v1/water-tests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        waterSource: sourceId,
        pH: 7.0,
        tds: 200,
        turbidity: 1.0,
        contaminants: [],
        status: 'Safe'
      })
      .expect(201);

    const res = await request(app)
      .get('/api/v1/water-tests/analytics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[0]).toHaveProperty('totalTests');
    expect(res.body[0]).toHaveProperty('safeCount');
  });

  test('DELETE /api/v1/water-tests/:id should delete a test (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/water-tests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        waterSource: sourceId,
        pH: 6.8,
        tds: 400,
        turbidity: 1.0,
        contaminants: [],
        status: 'Safe',
        tester: testerId
      })
      .expect(201);

    const testId = createRes.body._id;

    await request(app)
      .delete(`/api/v1/water-tests/${testId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
    // the generic test get endpoint will now fail to see it
    await request(app)
      .get(`/api/v1/water-tests/${testId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});