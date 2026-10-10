import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import * as argon2 from 'argon2';

vi.mock('argon2', () => ({
  verify: vi.fn(),
  hash: vi.fn(),
}));

describe('AuthService', () => {
  const usersService = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    updateLastLogin: vi.fn(),
    recordFailedLogin: vi.fn(),
    resetLoginAttempts: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
  const jwtService = { sign: vi.fn(() => 'access-token') };
  const sessionService = {
    createSession: vi.fn(async () => ({ sessionId: 's1', refreshToken: 'rt1' })),
    validateRefreshToken: vi.fn(),
    rotateSession: vi.fn(),
    revokeByRefreshToken: vi.fn(),
    revokeAllForUser: vi.fn(),
  };
  const authContextService = {};
  const passwordResetService = {
    createResetToken: vi.fn(),
    resetPassword: vi.fn(),
  };
  const workspaceResolver = { resolveForUser: vi.fn(), isWorkspaceAllowed: vi.fn() };
  const auditService = { logEvent: vi.fn() };

  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(
      usersService as any,
      jwtService as any,
      sessionService as any,
      authContextService as any,
      passwordResetService as any,
      workspaceResolver as any,
      auditService as any,
    );
  });

  it('rejects unknown user login', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(service.validateUser('a@b.com', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects invalid password', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hash',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
    vi.mocked(argon2.verify).mockResolvedValue(false);

    await expect(service.validateUser('a@b.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersService.recordFailedLogin).toHaveBeenCalled();
  });

  it('rejects locked account', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hash',
      status: 'LOCKED',
      failedLoginAttempts: 5,
      lockedUntil: new Date(Date.now() + 60000),
    });

    await expect(service.validateUser('a@b.com', 'password')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('issues tokens on successful login', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hash',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockedUntil: null,
      name: 'Test',
    });
    vi.mocked(argon2.verify).mockResolvedValue(true);

    const user = await service.validateUser('a@b.com', 'password');
    const tokens = await service.login(user);

    expect(tokens.access_token).toBe('access-token');
    expect(tokens.refresh_token).toBe('rt1');
    expect(usersService.resetLoginAttempts).toHaveBeenCalledWith('u1');
  });

  it('does not reveal email existence on forgot password', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(
      service.requestPasswordReset('missing@b.com'),
    ).resolves.toBeUndefined();
    expect(passwordResetService.createResetToken).not.toHaveBeenCalled();
  });
});
