import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';
import BlogPost from '../../models/BlogPost.js';

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'This is a mocked AI summary.' } }]
          })
        }
      }
    };
  });
});

describe('ai integration tests', () => {
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

  test('GET /api/v1/ai/summarize/blog/:id should return mocked summary', async () => {
    const postRes = await request(app).post('/api/v1/blog').set('Authorization', 'Bearer ' + adminToken).send({ title: 'The Post', content: 'Long content to summarize', status: 'Published' }).expect(201);
    
    const res = await request(app).get('/api/v1/ai/summarize/blog/' + postRes.body._id).expect(200);
    
    expect(res.body.summary).toBe('This is a mocked AI summary.');
    expect(res.body.cached).toBe(false);
  });
});
