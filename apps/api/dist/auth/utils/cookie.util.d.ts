import type { Response } from 'express';
import type { WorkspaceType } from '../types.js';
export declare function setAuthCookies(response: Response, accessToken: string, refreshToken: string): void;
export declare function clearAuthCookies(response: Response): void;
export declare function setWorkspaceCookie(response: Response, workspace: WorkspaceType, organizationId?: string | null): void;
export declare function parseWorkspaceCookie(raw?: string): {
    workspace: WorkspaceType;
    organizationId: string | null;
} | null;
