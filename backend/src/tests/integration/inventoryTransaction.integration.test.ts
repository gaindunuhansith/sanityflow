import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';
import { Resource } from '../../models/resource.model.js';
import { Supplier } from '../../models/supplier.model.js';

describe('inventoryTransaction integration tests', () => {
  let mongod: any;
  let adminToken: string;
  let userToken: string;
  let resourceId: string;

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

    // Create an admin
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

    // Create supplier to reference in Resource
    const supplier = await Supplier.create({
      name: 'Local Sup',
      contactPerson: 'Joe',
      email: 'joe@supplier.local',
      phone: '1234567890',
      address: '123 Main'
    });

    // Create a resource so we can transact on it
    const resDoc = await Resource.create({
      name: 'Water Bottles',
      category: 'Consumables',
      quantity: 50,
      unit: 'Boxes',
      supplier: supplier._id
    });
    resourceId = String(resDoc._id);
  });

  test('POST /api/v1/inventory-transactions should add an ADD transaction', async () => {
    const payload = {
      product: resourceId,
      type: 'ADD',
      quantity: 10,
      reason: 'Donation received'
    };

    const res = await request(app)
      .post('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    const transaction = res.body.transaction || res.body;

    expect(transaction).toBeDefined();
    expect(transaction.type).toBe('ADD');
    expect(transaction.quantity).toBe(10);

    // Verify it updated the quantity in the Resource object: 50 + 10 = 60
    const resourceCheck = await Resource.findById(resourceId);
    expect(resourceCheck?.quantity).toBe(60);
  });

  test('POST /api/v1/inventory-transactions should handle REMOVE transaction', async () => {
    const payload = {
      product: resourceId,
      type: 'REMOVE',
      quantity: 20,
      reason: 'Distributed'
    };

    const res = await request(app)
      .post('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);

    // Verify it updated the quantity in the Resource object: 50 - 20 = 30
    const resourceCheck = await Resource.findById(resourceId);
    expect(resourceCheck?.quantity).toBe(30);
  });

  test('POST /api/v1/inventory-transactions should reject REMOVE when quantity is insufficient', async () => {
    const payload = {
      product: resourceId,
      type: 'REMOVE',
      quantity: 100, // have 50 only
      reason: 'Distributed'
    };

    await request(app)
      .post('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(400);
      
    // verify nothing changed
    const resourceCheck = await Resource.findById(resourceId);
    expect(resourceCheck?.quantity).toBe(50);
  });

  test('GET /api/v1/inventory-transactions should list transactions', async () => {
    // create a transaction
    await request(app)
      .post('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ product: resourceId, type: 'ADD', quantity: 15, reason: 'Refill' })
      .expect(201);

    // fetch
    const res = await request(app)
      .get('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${userToken}`) // User can query?
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].type).toBe('ADD');
  });

  test('GET /api/v1/inventory-transactions/:id should return single transaction', async () => {
    const creatRes = await request(app)
      .post('/api/v1/inventory-transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ product: resourceId, type: 'ADD', quantity: 5, reason: 'Test get by ID' })
      .expect(201);

    const transaction = creatRes.body.transaction || creatRes.body;
    const id = transaction._id;

    const res = await request(app)
      .get(`/api/v1/inventory-transactions/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(res.body._id).toBe(id);
    expect(res.body.reason).toBe('Test get by ID');
  });
});