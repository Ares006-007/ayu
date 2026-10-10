import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import { SessionService } from './services/session.service.js';
import { AuthContextService } from './services/auth-context.service.js';
import { PasswordResetService } from './services/password-reset.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { WorkspaceType } from './types.js';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export interface TokenPayload {
  sub: string;
}

export interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private authContextService: AuthContextService,
    private passwordResetService: PasswordResetService,
    private workspaceResolver: WorkspaceResolverService,
    private auditService: AuditService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
    meta?: RequestMeta,
  ): Promise<{ id: string; email: string; name: string | null }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.passwordHash) {
      await this.auditService.logEvent({
        actorId: 'anonymous',
        action: 'AUTH_LOGIN_FAILED',
        resourceType: 'User',
        resourceId: email,
        outcome: 'FAILURE',
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        metadata: { reason: 'unknown_user' },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.auditService.logEvent({
        actorId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        resourceType: 'User',
        resourceId: user.id,
        outcome: 'DENIED',
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        metadata: { reason: 'account_locked' },
      });
      throw new ForbiddenException(
        'Your account is temporarily locked. Try again later or reset your password.',
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, pass);
    if (!isPasswordValid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= MAX_FAILED_ATTEMPTS
          ? new Date(Date.now() + LOCK_DURATION_MS)
          : null;

      await this.usersService.recordFailedLogin(user.id, attempts, lockedUntil);

      await this.auditService.logEvent({
        actorId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        resourceType: 'User',
        resourceId: user.id,
        outcome: 'FAILURE',
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        metadata: { reason: 'invalid_password', attempts },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.resetLoginAttempts(user.id);
    await this.usersService.updateLastLogin(user.id);

    return { id: user.id, email: user.email, name: user.name };
  }

  async login(
    user: { id: string; email: string },
    meta?: RequestMeta,
  ): Promise<{ access_token: string; refresh_token: string; sessionId: string }> {
    const { sessionId, refreshToken } = await this.sessionService.createSession(
      user.id,
      meta,
    );

    const payload: TokenPayload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    await this.auditService.logEvent({
      actorId: user.id,
      action: 'AUTH_LOGIN_SUCCESS',
      resourceType: 'Session',
      resourceId: sessionId,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      sessionId,
    };
  }

  async refreshSession(
    refreshToken: string,
    meta?: RequestMeta,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const session = await this.sessionService.validateRefreshToken(refreshToken);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(session.userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const rotated = await this.sessionService.rotateSession(
      session.sessionId,
      session.userId,
      meta,
    );

    const accessToken = this.jwtService.sign({ sub: session.userId });

    await this.auditService.logEvent({
      actorId: session.userId,
      action: 'AUTH_SESSION_REFRESH',
      resourceType: 'Session',
      resourceId: rotated.sessionId,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return {
      access_token: accessToken,
      refresh_token: rotated.refreshToken,
    };
  }

  async logout(
    userId: string,
    refreshToken: string,
    meta?: RequestMeta,
  ): Promise<void> {
    await this.sessionService.revokeByRefreshToken(refreshToken);

    await this.auditService.logEvent({
      actorId: userId,
      action: 'AUTH_LOGOUT',
      resourceType: 'Session',
      resourceId: userId,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  async logoutAll(userId: string, meta?: RequestMeta): Promise<void> {
    await this.sessionService.revokeAllForUser(userId);

    await this.auditService.logEvent({
      actorId: userId,
      action: 'AUTH_LOGOUT_ALL',
      resourceType: 'Session',
      resourceId: userId,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  async requestPasswordReset(email: string, meta?: RequestMeta): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Generic response — do not reveal whether email exists
      return;
    }

    const token = await this.passwordResetService.createResetToken(user.id);

    await this.auditService.logEvent({
      actorId: user.id,
      action: 'AUTH_PASSWORD_RESET_REQUEST',
      resourceType: 'User',
      resourceId: user.id,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`Password reset token for ${email}: ${token}`);
    }
    // Production: send email with reset link containing token
  }

  async resetPassword(
    token: string,
    password: string,
    meta?: RequestMeta,
  ): Promise<void> {
    const userId = await this.passwordResetService.resetPassword(token, password);

    await this.auditService.logEvent({
      actorId: userId,
      action: 'AUTH_PASSWORD_RESET_COMPLETE',
      resourceType: 'User',
      resourceId: userId,
      outcome: 'SUCCESS',
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  async switchWorkspace(
    userId: string,
    workspace: WorkspaceType,
    organizationId?: string,
    meta?: RequestMeta,
  ): Promise<void> {
    const resolved = await this.workspaceResolver.resolveForUser(userId);
    if (
      !this.workspaceResolver.isWorkspaceAllowed(
        resolved.workspaces,
        workspace,
        organizationId,
      )
    ) {
      await this.auditService.logEvent({
        actorId: userId,
        action: 'AUTH_WORKSPACE_DENIED',
        resourceType: 'Workspace',
        resourceId: workspace,
        outcome: 'DENIED',
        organizationId,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });
      throw new ForbiddenException('You do not have access to this workspace.');
    }

    await this.auditService.logEvent({
      actorId: userId,
      action: 'AUTH_WORKSPACE_SWITCH',
      resourceType: 'Workspace',
      resourceId: workspace,
      outcome: 'SUCCESS',
      organizationId,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  async validateFirebaseUser(
    idToken: string,
    meta?: RequestMeta,
  ): Promise<{ id: string; email: string; name: string | null }> {
    if (!getApps().length) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'ayush-a0b88',
      });
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const email = decodedToken.email;

      if (!email) {
        throw new BadRequestException('Firebase token does not contain an email');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.create({
          email,
          externalAuthId: decodedToken.uid,
          status: 'ACTIVE',
          name: decodedToken.name || null,
          emailVerifiedAt: decodedToken.email_verified ? new Date() : null,
        });
      } else if (!user.externalAuthId) {
        user = await this.usersService.update(user.id, {
          externalAuthId: decodedToken.uid,
        });
      }

      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Account is not active');
      }

      await this.usersService.updateLastLogin(user.id);

      return { id: user.id, email: user.email, name: user.name };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
