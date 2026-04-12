import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      weather: [{ main: 'Rain', description: 'light rain' }],
      main: { temp: 20, humidity: 80, pressure: 1010 },
      wind: { speed: 5 },
      rain: { '1h': 12 }
    }
  })
}));

describe('weather integration tests', () => {
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

  test('GET /api/v1/weather/:location should fetch weather mock', async () => {
    const res = await request(app)
      .get('/api/v1/weather/London')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);
      
    expect(res.body.condition).toBe('Rain');
    expect(res.body.isHighRisk).toBe(true);
    expect(res.body.rainfall_last_1h_mm).toBe(12);
  });
});
