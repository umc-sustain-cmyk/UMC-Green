const request = require('supertest');
const app = require('../../server');

describe('Health endpoint', () => {
  test('GET /api/health returns 200 and JSON payload', async () => {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });
});
