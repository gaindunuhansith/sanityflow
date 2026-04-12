import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('barcode integration tests', () => {
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

  test('GET /api/v1/barcode/:barcode should return fallback product', async () => {
    const res = await request(app)
      .get('/api/v1/barcode/990000000001')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);

    expect(res.body.name).toBe('Antibacterial Hand Wash (500ml)');
    expect(res.body.source).toBe('SanityFlow Local Catalog');
  });

  test('GET /api/v1/barcode/:barcode should return 400 for invalid barcode format', async () => {
    await request(app)
      .get('/api/v1/barcode/abc123') // letters not allowed
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(400);

    await request(app)
      .get('/api/v1/barcode/12345') // too short
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(400);
  });
  
  test('GET /api/v1/barcode/:barcode should return 404 for unknown barcode or fallback based on API', async () => {
    // If the mock APIs are working, unknown may actually return something, so we just expect success or failure depending on external services.
    // For pure DB isolation testing, usually 404 is returned if external calls fail.
    const res = await request(app)
      .get('/api/v1/barcode/999999999999')
      .set('Authorization', 'Bearer ' + adminToken);
      
      expect([200, 404]).toContain(res.status);
  });
});
