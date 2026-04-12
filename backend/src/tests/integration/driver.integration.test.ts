import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';
import User from '../../models/User.js';

describe('driver integration tests', () => {
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

  test('POST /api/v1/drivers should create a driver (admin)', async () => {
    const res = await request(app)
      .post('/api/v1/drivers')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: 'Sam', email: 'sam@test.com', password: 'password123', contact: '123', vehicleInfo: 'Truck', assignedArea: 'A', availability: 'Active' })
      .expect(201);
    expect(res.body.name).toBe('Sam');
  });

  test('GET /api/v1/drivers should list drivers (admin)', async () => {
    await request(app).post('/api/v1/drivers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Tom', email: 'tom@test.com', password: 'password123', contact: '456', vehicleInfo: 'Van', assignedArea: 'B', availability: 'Active' }).expect(201);
    const res = await request(app).get('/api/v1/drivers').set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/drivers/:id should get a driver (admin)', async () => {
    const createRes = await request(app).post('/api/v1/drivers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Jim', email: 'jim@test.com', password: 'password123', contact: '789', vehicleInfo: 'Car', assignedArea: 'C', availability: 'Active' }).expect(201);
    const res = await request(app).get('/api/v1/drivers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(200);
    expect(res.body.name).toBe('Jim');
  });

  test('PUT /api/v1/drivers/:id should update a driver (admin)', async () => {
    const createRes = await request(app).post('/api/v1/drivers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Bob', email: 'bob@test.com', password: 'password123', contact: '000', vehicleInfo: 'Jeep', assignedArea: 'D', availability: 'Active' }).expect(201);
    const res = await request(app).put('/api/v1/drivers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).send({ assignedArea: 'E', availability: 'Inactive' }).expect(200);
    expect(res.body.assignedArea).toBe('E');
    expect(res.body.availability).toBe('Inactive');
  });

  test('DELETE /api/v1/drivers/:id should remove a driver (admin)', async () => {
    const createRes = await request(app).post('/api/v1/drivers').set('Authorization', 'Bearer ' + adminToken).send({ name: 'Ned', email: 'ned@test.com', password: 'password123', contact: '111', vehicleInfo: 'Bus', assignedArea: 'F', availability: 'Active' }).expect(201);
    const res = await request(app).delete('/api/v1/drivers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken);
    expect([200, 204]).toContain(res.status);
    await request(app).get('/api/v1/drivers/' + createRes.body._id).set('Authorization', 'Bearer ' + adminToken).expect(404);
  });
});
