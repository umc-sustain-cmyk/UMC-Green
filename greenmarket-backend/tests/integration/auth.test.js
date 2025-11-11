const request = require('supertest');
const app = require('../../server');

describe('Auth integration tests', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@crk.umn.edu',
    password: 'password123',
    role: 'student'
  };

  test('POST /api/auth/register - successful registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user).toHaveProperty('email', testUser.email.toLowerCase());
    expect(res.body.data).toHaveProperty('token');
  });

  test('POST /api/auth/register - invalid email domain', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'bad@notumn.com' })
      .expect(400);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/register - duplicate email', async () => {
    // Try to register the same user again
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(400);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test('POST /api/auth/login - successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' })
      .expect(400);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });
});
