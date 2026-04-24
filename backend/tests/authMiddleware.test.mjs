import { describe, it, expect, vi, beforeEach } from 'vitest';
const authMiddleware = require('../middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, query: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  // ─── Happy paths ─────────────────────────────────────────────────────────────

  it('should call next() and set req.user when x-user-id header is present', () => {
    req.headers['x-user-id'] = 'user-abc-123';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ id: 'user-abc-123' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next() and set req.user when userId query param is present (fallback)', () => {
    req.query.userId = 'user-from-query';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ id: 'user-from-query' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should prefer x-user-id header over userId query param', () => {
    req.headers['x-user-id'] = 'header-user';
    req.query.userId = 'query-user';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ id: 'header-user' });
  });

  // ─── Sad paths ────────────────────────────────────────────────────────────────

  it('should return 401 and NOT call next() when no credentials are provided', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when x-user-id header is an empty string', () => {
    req.headers['x-user-id'] = '';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
