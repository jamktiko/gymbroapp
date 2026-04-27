const jwt = require('jsonwebtoken');
/* global describe, it, expect, beforeAll, afterEach, afterAll */

const request = require('supertest');
const app = require('../app');
const setup = require('./setup');
const User = require('../models/User');

// A dummy user ID sent as the x-user-id header to satisfy auth middleware.
// auth.js reads this header in dev mode — no vi.mock() needed.
const DUMMY_USER_ID = 'test-user-123';

describe('Users Controller', () => {
  beforeAll(async () => {
    await setup.connectDB();
  });

  afterEach(async () => {
    await setup.clearDB();
  });

  afterAll(async () => {
    await setup.closeDB();
  });

  // ─── POST /api/users ────────────────────────────────────────────────────────

  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        googleId: 'google-john',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');

      const userInDb = await User.findById(response.body._id);
      expect(userInDb).toBeTruthy();
    });

    it('should return 400 if email is already in use', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        googleId: 'google-jane-1',
      };
      await User.create(userData);

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Sähköposti on jo käytössä');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('User validation failed');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'User', email: 'user@example.com' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── GET /api/users/:id ─────────────────────────────────────────────────────

  describe('GET /api/users/:id', () => {
    it('should return a user by id with 200 status', async () => {
      const user = await User.create({
        name: 'Alice',
        email: 'alice@example.com',
        googleId: 'google-alice',
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(user._id.toString());
      expect(response.body.name).toBe('Alice');
    });

    it('should return 404 if user is not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 500 if id is invalid (cast error)', async () => {
      const response = await request(app)
        .get('/api/users/invalid_id')
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get(
        '/api/users/507f1f77bcf86cd799439011',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── PATCH /api/users/:id ───────────────────────────────────────────────────

  describe('PATCH /api/users/:id', () => {
    it('should update a user and return 200', async () => {
      const user = await User.create({
        name: 'Bob',
        email: 'bob@example.com',
        googleId: 'google-bob1',
      });

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send({ weightUnit: 'lbs' });

      expect(response.status).toBe(200);
      expect(response.body.weightUnit).toBe('lbs');

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.weightUnit).toBe('lbs');
    });

    it('should return 404 if user to update is not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .patch(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 400 on validation error', async () => {
      const user = await User.create({
        name: 'Bob',
        email: 'bob@example.com',
        googleId: 'google-bob2',
      });

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`)
        .send({ weightUnit: 'invalid_unit' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .patch('/api/users/507f1f77bcf86cd799439011')
        .send({ name: 'Bob' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── DELETE /api/users/:id ──────────────────────────────────────────────────

  describe('DELETE /api/users/:id', () => {
    it('should delete a user and return 200', async () => {
      const user = await User.create({
        name: 'Charlie',
        email: 'charlie@example.com',
        googleId: 'google-charlie',
      });

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Käyttäjä poistettu');

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user to delete is not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 500 if id is invalid (cast error)', async () => {
      const response = await request(app)
        .delete('/api/users/invalid_id')
        .set('Authorization', `Bearer ${jwt.sign({ id: DUMMY_USER_ID }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).delete(
        '/api/users/507f1f77bcf86cd799439011',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
