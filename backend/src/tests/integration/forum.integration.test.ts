import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('forum integration tests', () => {
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

  test('POST /api/v1/community/forum should create a thread', async () => {
    const res = await request(app)
      .post('/api/v1/community/forum')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ title: 'First thread', content: 'Hello forum', tags: ['general'], status: 'Open' })
      .expect(201);
    expect(res.body.title).toBe('First thread');
  });

  test('GET /api/v1/community/forum should list threads', async () => {
    await request(app).post('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).send({ title: 'T2', content: 'C2' }).expect(201);
    const res = await request(app).get('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.threads).toBeDefined();
  });

  test('GET /api/v1/community/forum/:id should get a thread', async () => {
    const createRes = await request(app).post('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).send({ title: 'T3', content: 'C3' }).expect(201);
    const res = await request(app).get('/api/v1/community/forum/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.title).toBe('T3');
  });

  test('PUT /api/v1/community/forum/:id should update a thread', async () => {
    const createRes = await request(app).post('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).send({ title: 'T4', content: 'C4' }).expect(201);
    const res = await request(app).patch('/api/v1/community/forum/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).send({ status: 'Closed' }).expect(200);
    expect(res.body.status).toBe('Closed');
  });

  test('DELETE /api/v1/community/forum/:id should remove a thread', async () => {
    const createRes = await request(app).post('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).send({ title: 'T5', content: 'C5' }).expect(201);
    await request(app).delete('/api/v1/community/forum/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(204);
    await request(app).get('/api/v1/community/forum/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(404);
  });

  test('POST /api/v1/community/forum/:id/replies should add a reply', async () => {
    const createRes = await request(app).post('/api/v1/community/forum').set('Authorization', 'Bearer ' + adminToken).send({ title: 'T6', content: 'C6' }).expect(201);
    const res = await request(app).post('/api/v1/community/forum/' + createRes.body._id + '/replies').set('Authorization', 'Bearer ' + adminToken).send({ content: 'R1' }).expect(201);
    expect(res.body.content).toBe('R1');
  });
});
