import type { Response } from 'express';
import type { WorkspaceType } from '../types.js';

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const WORKSPACE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function cookieOptions(maxAge: number, path = '/') {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path,
  };
}

export function setAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
): void {
  response.cookie('access_token', accessToken, cookieOptions(ACCESS_MAX_AGE));
  response.cookie(
    'refresh_token',
    refreshToken,
    cookieOptions(REFRESH_MAX_AGE, '/api/v1/auth/refresh'),
  );
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie('access_token');
  response.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
  response.clearCookie('ayu_workspace');
}

export function setWorkspaceCookie(
  response: Response,
  workspace: WorkspaceType,
  organizationId?: string | null,
): void {
  const value = organizationId ? `${workspace}:${organizationId}` : workspace;
  response.cookie('ayu_workspace', value, cookieOptions(WORKSPACE_MAX_AGE));
}

export function parseWorkspaceCookie(
  raw?: string,
): { workspace: WorkspaceType; organizationId: string | null } | null {
  if (!raw) return null;
  const [workspace, organizationId] = raw.split(':');
  if (!workspace) return null;
  return {
    workspace: workspace as WorkspaceType,
    organizationId: organizationId || null,
  };
}
