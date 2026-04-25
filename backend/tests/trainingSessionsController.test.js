const jwt = require('jsonwebtoken');
/* global describe, it, expect, beforeAll, afterEach, afterAll */

const request = require('supertest');
const app = require('../app');
const setup = require('./setup');
const User = require('../models/User');
const mongoose = require('mongoose');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createUser = async (overrides = {}) => {
  const user = await User.create({
    name: 'Session Test User',
    email: `sessionuser-${Date.now()}@example.com`,
    googleId: `google-user-${Date.now()}`,
    ...overrides,
  });
  return { user, userId: user._id.toString() };
};

// A minimal valid embedded move object (matches EmbeddedMoveSchema).
// trainingSessions store the full move object — NOT an ObjectId ref.
const embeddedMove = {
  name: 'Bench Press',
  type: 'compound',
  muscleGroup: 'chest',
  isDefault: true,
  createdBy: null,
};

// A minimal valid session payload that satisfies TrainingSessionSchema validation.
const validSessionPayload = {
  datetime: new Date('2024-03-01T10:00:00Z').toISOString(),
  breakTimeSeconds: 90,
  exercises: [
    {
      move: embeddedMove,
      sets: [
        { reps: 10, weight: 80 },
        { reps: 8, weight: 85 },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────

describe('Training Sessions Controller', () => {
  beforeAll(async () => {
    await setup.connectDB();
  });

  afterEach(async () => {
    await setup.clearDB();
  });

  afterAll(async () => {
    await setup.closeDB();
  });

  // ─── GET /api/training-sessions ──────────────────────────────────────────────

  describe('GET /api/training-sessions', () => {
    it('should return an empty array when the user has no sessions', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .get('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return the user's sessions sorted newest-first", async () => {
      const { user, userId } = await createUser();

      const olderSession = {
        ...validSessionPayload,
        datetime: new Date('2024-01-01T10:00:00Z'),
      };
      const newerSession = {
        ...validSessionPayload,
        datetime: new Date('2024-06-01T10:00:00Z'),
      };

      user.trainingSessions.push(olderSession);
      user.trainingSessions.push(newerSession);
      await user.save();

      const response = await request(app)
        .get('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      // Newest first
      expect(new Date(response.body[0].datetime).getTime()).toBeGreaterThan(
        new Date(response.body[1].datetime).getTime(),
      );
    });

    it('should filter sessions by ?from= query param', async () => {
      const { user, userId } = await createUser();

      user.trainingSessions.push({
        ...validSessionPayload,
        datetime: new Date('2024-01-15T10:00:00Z'),
      });
      user.trainingSessions.push({
        ...validSessionPayload,
        datetime: new Date('2024-07-15T10:00:00Z'),
      });
      await user.save();

      const response = await request(app)
        .get('/api/training-sessions?from=2024-06-01')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(new Date(response.body[0].datetime).getFullYear()).toBe(2024);
      expect(new Date(response.body[0].datetime).getMonth()).toBe(6); // July (0-indexed)
    });

    it('should filter sessions by ?to= query param', async () => {
      const { user, userId } = await createUser();

      user.trainingSessions.push({
        ...validSessionPayload,
        datetime: new Date('2024-01-15T10:00:00Z'),
      });
      user.trainingSessions.push({
        ...validSessionPayload,
        datetime: new Date('2024-07-15T10:00:00Z'),
      });
      await user.save();

      const response = await request(app)
        .get('/api/training-sessions?to=2024-03-01')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(new Date(response.body[0].datetime).getMonth()).toBe(0); // January
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get('/api/training-sessions');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── GET /api/training-sessions/:id ──────────────────────────────────────────

  describe('GET /api/training-sessions/:id', () => {
    it('should return a session by id with 200 status', async () => {
      const { user, userId } = await createUser();
      user.trainingSessions.push(validSessionPayload);
      await user.save();
      const sessionId = user.trainingSessions[0]._id.toString();

      const response = await request(app)
        .get(`/api/training-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(sessionId);
      expect(response.body.exercises).toHaveLength(1);
    });

    it('should return 404 if the session sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/training-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treenisessiota ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/training-sessions/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get(
        `/api/training-sessions/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── POST /api/training-sessions ─────────────────────────────────────────────

  describe('POST /api/training-sessions', () => {
    it('should create a new session and return 201', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send(validSessionPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.exercises).toHaveLength(1);
      expect(response.body.breakTimeSeconds).toBe(90);

      const saved = await User.findById(userId);
      expect(saved.trainingSessions).toHaveLength(1);
    });

    it('should return 400 if exercises array is empty', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ ...validSessionPayload, exercises: [] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if an exercise has no sets', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({
          ...validSessionPayload,
          exercises: [{ move: embeddedMove, sets: [] }],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if required move field is missing from an exercise', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({
          ...validSessionPayload,
          exercises: [{ sets: [{ reps: 10, weight: 50 }] }],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .post('/api/training-sessions')
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`)
        .send(validSessionPayload);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .post('/api/training-sessions')
        .send(validSessionPayload);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── PATCH /api/training-sessions/:id ────────────────────────────────────────

  describe('PATCH /api/training-sessions/:id', () => {
    it('should update a session and return 200', async () => {
      const { user, userId } = await createUser();
      user.trainingSessions.push(validSessionPayload);
      await user.save();
      const sessionId = user.trainingSessions[0]._id.toString();

      const response = await request(app)
        .patch(`/api/training-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ breakTimeSeconds: 180 });

      expect(response.status).toBe(200);
      expect(response.body.breakTimeSeconds).toBe(180);

      const updated = await User.findById(userId);
      expect(updated.trainingSessions[0].breakTimeSeconds).toBe(180);
    });

    it('should return 400 if breakTimeSeconds is below minimum (1)', async () => {
      const { user, userId } = await createUser();
      user.trainingSessions.push(validSessionPayload);
      await user.save();
      const sessionId = user.trainingSessions[0]._id.toString();

      const response = await request(app)
        .patch(`/api/training-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ breakTimeSeconds: 0 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 if the session sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .patch(`/api/training-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ breakTimeSeconds: 60 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treenisessiota ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .patch(`/api/training-sessions/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`)
        .send({ breakTimeSeconds: 60 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .patch(`/api/training-sessions/${new mongoose.Types.ObjectId()}`)
        .send({ breakTimeSeconds: 60 });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── DELETE /api/training-sessions/:id ───────────────────────────────────────

  describe('DELETE /api/training-sessions/:id', () => {
    it('should delete a session and return 200', async () => {
      const { user, userId } = await createUser();
      user.trainingSessions.push(validSessionPayload);
      await user.save();
      const sessionId = user.trainingSessions[0]._id.toString();

      const response = await request(app)
        .delete(`/api/training-sessions/${sessionId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Treenisessio poistettu');

      const afterDelete = await User.findById(userId);
      expect(afterDelete.trainingSessions).toHaveLength(0);
    });

    it('should return 404 if the session sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/training-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treenisessiota ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/training-sessions/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).delete(
        `/api/training-sessions/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
