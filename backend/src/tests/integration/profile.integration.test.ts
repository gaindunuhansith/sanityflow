import request from 'supertest';
import app from '../../app.js';
import { startInMemoryMongo, stopInMemoryMongo, clearDatabase } from './mongoMemory.js';

describe('profile integration tests', () => {
  let mongod: any;

  beforeAll(async () => {
    mongod = await startInMemoryMongo();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('Placeholder for profile endpoints', async () => {
    expect(true).toBe(true);
  });
});