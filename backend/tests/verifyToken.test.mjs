import { describe, it, expect, vi, beforeEach } from 'vitest';
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

describe('VerifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, query: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_vitest';
  });

  // ─── Happy paths ─────────────────────────────────────────────────────────────

  it('should call next() and set req.user when a valid Bearer token is provided', () => {
    const payload = { id: 'user-abc-123' };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    req.headers['authorization'] = `Bearer ${token}`;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ id: 'user-abc-123' });
    expect(res.status).not.toHaveBeenCalled();
  });

  // ─── Sad paths ────────────────────────────────────────────────────────────────

  it('should return 401 and NOT call next() when no credentials are provided', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when auth header is missing Bearer prefix', () => {
    req.headers['authorization'] = 'Basic some-token';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid or manipulated', () => {
    req.headers['authorization'] = 'Bearer definitely-not-a-valid-token';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
});
