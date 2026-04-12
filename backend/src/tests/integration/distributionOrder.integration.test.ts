import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';
import { Resource } from '../../models/resource.model.js';
import { Supplier } from '../../models/supplier.model.js';

describe('distributionOrder integration tests', () => {
  let mongod: any;
  let adminToken: string;
  let driverToken: string;
  let userToken: string;
  let resourceId: string;
  let driverId: string;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Normal User
    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'password' });
    userToken = userRes.body.token;

    // Admin
    const a = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' });
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    adminToken = adminRes.body.token;

    // Driver
    const driver = await User.create({ name: 'Driver', email: 'driver@example.com', password: 'password', role: 'driver' });
    driverId = String(driver._id);
    const driverRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'driver@example.com', password: 'password' });
    driverToken = driverRes.body.token;

    // Supplier & Resource
    const supplier = await Supplier.create({
      name: 'Sup', contactPerson: 'Joe', email: 's@s.com', phone: '123', address: '123'
    });

    const resDoc = await Resource.create({
      name: 'Water Bottles', category: 'Consumables', quantity: 100, unit: 'Boxes', supplier: supplier._id
    });
    resourceId = String(resDoc._id);
  });

  test('POST /api/v1/distributions should create a distribution order (admin)', async () => {
    const payload = {
      resource: resourceId,
      quantity: 10,
      targetLocation: 'North Village',
      notes: 'Urgent'
    };

    const res = await request(app)
      .post('/api/v1/distributions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.quantity).toBe(10);
    expect(res.body.targetLocation).toBe('North Village');
    
    // Status is 'Pending' by default or if there's no custom handling inside the creation (e.g. Assigned logic might be handled separately later)
    expect(res.body.status).toBe('Pending'); 
  });

  test('POST /api/v1/distributions fails for normal users', async () => {
    await request(app)
      .post('/api/v1/distributions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ resource: resourceId, quantity: 5, targetLocation: 'Somewhere' })
      .expect(403);
  });

  test('GET /api/v1/distributions lists orders (admin/driver)', async () => {
    // 1. Create order
    const oRes = await request(app)
      .post('/api/v1/distributions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resource: resourceId, quantity: 10, targetLocation: 'Town 1' })
      .expect(201);

    // 2. Assign driver
    await request(app)
      .put(`/api/v1/distributions/${oRes.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ driver: driverId })
      .expect(200);

    // Driver gets list
    const res = await request(app)
      .get('/api/v1/distributions')
      .set('Authorization', `Bearer ${driverToken}`)
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].quantity).toBe(10);
  });

  test('PUT /api/v1/distributions/:id/status updates delivery status (driver)', async () => {
    // Admin creates order
    const createRes = await request(app)
      .post('/api/v1/distributions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resource: resourceId, quantity: 5, targetLocation: 'Town 1' })
      .expect(201);

    const id = createRes.body._id;

    // Admin MUST assign order to the Driver
    await request(app)
      .put(`/api/v1/distributions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ driver: driverId })
      .expect(200);

    // Driver sets to In Transit
    const res = await request(app)
      .put(`/api/v1/distributions/${id}/status`)
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ status: 'In Transit' })
      .expect(200);

    expect(res.body.status).toBe('In Transit');
  });

  test('DELETE /api/v1/distributions/:id removes an order (admin)', async () => {
    const createRes = await request(app)
      .post('/api/v1/distributions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resource: resourceId, quantity: 5, targetLocation: 'Town X' })
      .expect(201);

    const id = createRes.body._id;

    await request(app)
      .delete(`/api/v1/distributions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);

    // Order shouldn't be found
    await request(app)
      .get(`/api/v1/distributions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});