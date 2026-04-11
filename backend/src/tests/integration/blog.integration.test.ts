import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('blog integration tests', () => {
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

  test('POST /api/v1/blog should create a blog post', async () => {
    const res = await request(app)
      .post('/api/v1/blog')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ title: 'First Post', content: 'Hello world', tags: ['news'], status: 'Draft' })
      .expect(201);
    expect(res.body.title).toBe('First Post');
  });

  test('GET /api/v1/blog should list blog posts', async () => {
    await request(app).post('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).send({ title: 'Post 2', content: 'World' }).expect(201);
    const res = await request(app).get('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.posts).toBeDefined();
  });

  test('GET /api/v1/blog/:id should get a blog post', async () => {
    const createRes = await request(app).post('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).send({ title: 'Post 3', content: 'Hi' }).expect(201);
    const res = await request(app).get('/api/v1/blog/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.title).toBe('Post 3');
  });

  test('PUT /api/v1/blogs/:id should update a blog post', async () => {
    const createRes = await request(app).post('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).send({ title: 'Post 4', content: 'Hello' }).expect(201);
    const res = await request(app).patch('/api/v1/blog/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).send({ status: 'Published' }).expect(200);
    expect(res.body.status).toBe('Published');
  });

  test('DELETE /api/v1/blogs/:id should remove a blog post', async () => {
    const createRes = await request(app).post('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).send({ title: 'Post 5', content: 'To del' }).expect(201);
    await request(app).delete('/api/v1/blog/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(204);
    await request(app).get('/api/v1/blog/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(404);
  });
});
