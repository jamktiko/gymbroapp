/* global describe, it, expect, beforeAll, afterEach, afterAll */

const request = require('supertest');
const app = require('../app');
const setup = require('./setup');
const { Move } = require('../models/Move');
const mongoose = require('mongoose');

// A valid ObjectId string to use as the auth header.
// movesController uses req.user.id as a filter value (not for DB lookup),
// so any string works — but we use a real ObjectId to mimic production shape.
const DUMMY_USER_ID = new mongoose.Types.ObjectId().toString();

// ─── Seed helpers ─────────────────────────────────────────────────────────────

const defaultMoveData = {
  name: 'Bench Press',
  type: 'compound',
  muscleGroup: 'chest',
  isDefault: true,
  createdBy: null,
};

const userMoveData = {
  name: 'Custom Curl',
  type: 'targeted',
  muscleGroup: 'biceps',
  isDefault: false,
  createdBy: new mongoose.Types.ObjectId(DUMMY_USER_ID),
};

// ──────────────────────────────────────────────────────────────────────────────

describe('Moves Controller', () => {
  beforeAll(async () => {
    await setup.connectDB();
  });

  afterEach(async () => {
    await setup.clearDB();
  });

  afterAll(async () => {
    await setup.closeDB();
  });

  // ─── GET /api/moves ──────────────────────────────────────────────────────────

  describe('GET /api/moves', () => {
    it('should return an empty array when no moves exist', async () => {
      const response = await request(app)
        .get('/api/moves')
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return default moves for any authenticated user', async () => {
      await Move.create(defaultMoveData);

      const response = await request(app)
        .get('/api/moves')
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Bench Press');
    });

    it("should return both default moves and the caller's own moves", async () => {
      await Move.create(defaultMoveData);
      await Move.create(userMoveData);

      // A completely different user — should NOT see userMoveData
      const otherUserId = new mongoose.Types.ObjectId().toString();
      await Move.create({
        name: 'Other User Move',
        type: 'targeted',
        muscleGroup: 'back',
        isDefault: false,
        createdBy: new mongoose.Types.ObjectId(otherUserId),
      });

      const response = await request(app)
        .get('/api/moves')
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(200);
      // default + caller's own = 2; other user's move excluded
      expect(response.body).toHaveLength(2);
      const names = response.body.map((m) => m.name);
      expect(names).toContain('Bench Press');
      expect(names).toContain('Custom Curl');
      expect(names).not.toContain('Other User Move');
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get('/api/moves');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── GET /api/moves/:id ──────────────────────────────────────────────────────

  describe('GET /api/moves/:id', () => {
    it('should return a move by id with 200 status', async () => {
      const move = await Move.create(defaultMoveData);

      const response = await request(app)
        .get(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(move._id.toString());
      expect(response.body.name).toBe('Bench Press');
    });

    it('should return 404 if move is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/moves/${fakeId}`)
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Liikettä ei löytynyt');
    });

    it('should return 500 if id is an invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/moves/not-an-id')
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).get(
        `/api/moves/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── POST /api/moves ─────────────────────────────────────────────────────────

  describe('POST /api/moves', () => {
    it('should create a new move and return 201', async () => {
      const payload = {
        name: 'Squat',
        type: 'compound',
        muscleGroup: 'legs',
      };

      const response = await request(app)
        .post('/api/moves')
        .set('x-user-id', DUMMY_USER_ID)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Squat');
      // Controller always forces isDefault to false
      expect(response.body.isDefault).toBe(false);
      // Controller sets createdBy to req.user.id
      expect(response.body.createdBy).toBe(DUMMY_USER_ID);

      const inDb = await Move.findById(response.body._id);
      expect(inDb).toBeTruthy();
    });

    it('should return 400 if a duplicate move name exists', async () => {
      await Move.create({ ...defaultMoveData, name: 'Deadlift' });

      const response = await request(app)
        .post('/api/moves')
        .set('x-user-id', DUMMY_USER_ID)
        .send({ name: 'Deadlift', type: 'compound', muscleGroup: 'back' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Samanniminen liike on jo olemassa');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/moves')
        .set('x-user-id', DUMMY_USER_ID)
        .send({ muscleGroup: 'chest' }); // missing name and type

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if type is not a valid enum value', async () => {
      const response = await request(app)
        .post('/api/moves')
        .set('x-user-id', DUMMY_USER_ID)
        .send({ name: 'Invalid Move', type: 'isolation', muscleGroup: 'arms' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .post('/api/moves')
        .send({ name: 'Push Up', type: 'compound', muscleGroup: 'chest' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── PATCH /api/moves/:id ────────────────────────────────────────────────────

  describe('PATCH /api/moves/:id', () => {
    it('should update a user-owned move and return 200', async () => {
      const move = await Move.create(userMoveData);

      const response = await request(app)
        .patch(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID)
        .send({ muscleGroup: 'forearms' });

      expect(response.status).toBe(200);
      expect(response.body.muscleGroup).toBe('forearms');

      const updated = await Move.findById(move._id);
      expect(updated.muscleGroup).toBe('forearms');
    });

    it('should return 403 if trying to update a default move', async () => {
      const move = await Move.create(defaultMoveData);

      const response = await request(app)
        .patch(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID)
        .send({ muscleGroup: 'triceps' });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Default-liikettä ei voi muokata');
    });

    it('should return 404 if move to update is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .patch(`/api/moves/${fakeId}`)
        .set('x-user-id', DUMMY_USER_ID)
        .send({ muscleGroup: 'shoulders' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Liikettä ei löytynyt');
    });

    it('should return 400 on validation error (invalid enum)', async () => {
      const move = await Move.create(userMoveData);

      const response = await request(app)
        .patch(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID)
        .send({ type: 'invalid_type' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app)
        .patch(`/api/moves/${new mongoose.Types.ObjectId()}`)
        .send({ muscleGroup: 'chest' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  // ─── DELETE /api/moves/:id ───────────────────────────────────────────────────

  describe('DELETE /api/moves/:id', () => {
    it('should delete a user-owned move and return 200', async () => {
      const move = await Move.create(userMoveData);

      const response = await request(app)
        .delete(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Liike poistettu');

      const deleted = await Move.findById(move._id);
      expect(deleted).toBeNull();
    });

    it('should return 403 if trying to delete a default move', async () => {
      const move = await Move.create(defaultMoveData);

      const response = await request(app)
        .delete(`/api/moves/${move._id}`)
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Default-liikettä ei voi poistaa');

      // Confirm move still exists in DB
      const stillThere = await Move.findById(move._id);
      expect(stillThere).toBeTruthy();
    });

    it('should return 404 if move to delete is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/moves/${fakeId}`)
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Liikettä ei löytynyt');
    });

    it('should return 500 if id is an invalid ObjectId', async () => {
      const response = await request(app)
        .delete('/api/moves/not-an-id')
        .set('x-user-id', DUMMY_USER_ID);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if no auth header is provided', async () => {
      const response = await request(app).delete(
        `/api/moves/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
