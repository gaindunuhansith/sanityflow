import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('issue integration tests', () => {
  let mongod: any;
  let adminToken: string;
  let userToken: string;
  let adminId: string;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Register a standard user
    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;

    // Create an admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminId = String(admin._id);

    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  test('POST /api/v1/issues should create an issue (admin)', async () => {
    const payload = {
      issueType: 'Water Quality',
      description: 'The well is contaminated',
      location: 'Village Center',
      priority: 'High'
    };

    const res = await request(app)
      .post('/api/v1/issues')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.issueType).toBe('Water Quality');
    // reporter is usually derived from the authentication token
    const reporterId = typeof res.body.reporter === 'object' ? res.body.reporter._id : res.body.reporter;
    expect(reporterId).toBeDefined();
  });

  test('POST /api/v1/issues should fail for normal user', async () => {
    await request(app)
      .post('/api/v1/issues')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ issueType: 'Infrastructure', description: 'Broken pipe', location: 'X' })
      .expect(403);
  });

  test('GET /api/v1/issues should list issues', async () => {
    await request(app)
      .post('/api/v1/issues')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ issueType: 'Water Shortage', description: 'No water for 3 days', location: 'South side' })
      .expect(201);

    const res = await request(app)
      .get('/api/v1/issues')
      .set('Authorization', `Bearer ${userToken}`) // assuming lists are available to users
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].issueType).toBe('Water Shortage');
  });

  test('PUT /api/v1/issues/:id should update an issue (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/issues')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ issueType: 'Other', description: 'Need checking', location: 'Loc Z' })
      .expect(201);

    const id = createRes.body._id;

    const res = await request(app)
      .put(`/api/v1/issues/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'In Progress', resolutionNotes: 'Team dispatched' })
      .expect(200);

    expect(res.body.status).toBe('In Progress');
    expect(res.body.resolutionNotes).toBe('Team dispatched');
  });

  test('DELETE /api/v1/issues/:id should remove an issue (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/issues')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ issueType: 'Other', description: 'temp', location: 'loc' })
      .expect(201);

    const id = createRes.body._id;

    await request(app)
      .delete(`/api/v1/issues/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
    await request(app)
      .get(`/api/v1/issues/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});