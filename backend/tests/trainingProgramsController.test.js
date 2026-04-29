const jwt = require('jsonwebtoken');
/* global describe, it, expect, beforeAll, afterEach, afterAll */

const request = require('supertest');
const app = require('../app');
const setup = require('./setup');
const User = require('../models/User');
const mongoose = require('mongoose');

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Create a user in the DB and return both the user doc and its id as a string.
// The x-user-id header must equal user._id.toString() because the controller
// does User.findById(req.user.id) — so we cannot use a hardcoded placeholder here.
const createUser = async (overrides = {}) => {
  const user = await User.create({
    name: 'Test User',
    email: `testuser-${Date.now()}@example.com`,
    googleId: `google-user-${Date.now()}`,
    ...overrides,
  });
  return { user, userId: user._id.toString() };
};

// A minimal valid training program payload
const validProgramPayload = {
  name: 'Strength A',
  description: 'Push/pull split',
  isDefault: false,
  exercises: [
    {
      move: {
        name: 'Penkkipunnerrus',
        type: 'compound',
        muscleGroup: 'Rinta',
      },
      sets: [
        { reps: 10, weight: 60 }
      ]
    }
  ],
};

// ──────────────────────────────────────────────────────────────────────────────

describe('Training Programs Controller', () => {
  beforeAll(async () => {
    await setup.connectDB();
  });

  afterEach(async () => {
    await setup.clearDB();
  });

  afterAll(async () => {
    await setup.closeDB();
  });

  // ─── GET /api/training-programs ──────────────────────────────────────────────

  describe('GET /api/training-programs', () => {
    it('should return an empty array when the user has no programs', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .get('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return the user's training programs", async () => {
      const { user, userId } = await createUser();
      user.trainingPrograms.push(validProgramPayload);
      await user.save();

      const response = await request(app)
        .get('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Strength A');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get('/api/training-programs');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── GET /api/training-programs/:id ─────────────────────────────────────────

  describe('GET /api/training-programs/:id', () => {
    it('should return a program by id with 200 status', async () => {
      const { user, userId } = await createUser();
      user.trainingPrograms.push(validProgramPayload);
      await user.save();
      const programId = user.trainingPrograms[0]._id.toString();

      const response = await request(app)
        .get(`/api/training-programs/${programId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(programId);
      expect(response.body.name).toBe('Strength A');
    });

    it('should return 404 if the sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/training-programs/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treeniohjelmaa ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/training-programs/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get(
        `/api/training-programs/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── POST /api/training-programs ─────────────────────────────────────────────

  describe('POST /api/training-programs', () => {
    it('should create a new program and return 201', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send(validProgramPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Strength A');

      // Confirm persisted in DB
      const saved = await User.findById(userId);
      expect(saved.trainingPrograms).toHaveLength(1);
    });

    it('should return 400 if required field (name) is missing', async () => {
      const { userId } = await createUser();

      const response = await request(app)
        .post('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ description: 'No name provided' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .post('/api/training-programs')
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`)
        .send(validProgramPayload);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .post('/api/training-programs')
        .send(validProgramPayload);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── PATCH /api/training-programs/:id ────────────────────────────────────────

  describe('PATCH /api/training-programs/:id', () => {
    it('should update a program and return 200', async () => {
      const { user, userId } = await createUser();
      user.trainingPrograms.push(validProgramPayload);
      await user.save();
      const programId = user.trainingPrograms[0]._id.toString();

      const response = await request(app)
        .patch(`/api/training-programs/${programId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated description');

      const updated = await User.findById(userId);
      expect(updated.trainingPrograms[0].description).toBe(
        'Updated description',
      );
    });

    it('should return 404 if the program sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .patch(`/api/training-programs/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`)
        .send({ name: 'Ghost Program' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treeniohjelmaa ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .patch(`/api/training-programs/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`)
        .send({ name: 'X' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .patch(`/api/training-programs/${new mongoose.Types.ObjectId()}`)
        .send({ name: 'X' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── DELETE /api/training-programs/:id ───────────────────────────────────────

  describe('DELETE /api/training-programs/:id', () => {
    it('should delete a program and return 200', async () => {
      const { user, userId } = await createUser();
      user.trainingPrograms.push(validProgramPayload);
      await user.save();
      const programId = user.trainingPrograms[0]._id.toString();

      const response = await request(app)
        .delete(`/api/training-programs/${programId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Treeniohjelma poistettu');

      const afterDelete = await User.findById(userId);
      expect(afterDelete.trainingPrograms).toHaveLength(0);
    });

    it('should return 404 if the program sub-document is not found', async () => {
      const { userId } = await createUser();
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/training-programs/${fakeId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Treeniohjelmaa ei löytynyt');
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/training-programs/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: nonExistentId }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Käyttäjää ei löytynyt');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).delete(
        `/api/training-programs/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
