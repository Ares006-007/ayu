import type { CurrentUserResponse, LoginCredentials, WorkspaceType } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new ApiError('Your session has expired. Sign in again.', 401, 'SESSION_EXPIRED');
  }

  if (response.status === 403) {
    throw new ApiError('You do not have access to this resource.', 403, 'FORBIDDEN');
  }

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = await response.json();
      if (body.message) {
        message = Array.isArray(body.message) ? body.message[0] : body.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login(credentials: LoginCredentials) {
    return request<CurrentUserResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return request<{ message: string }>('/v1/auth/logout', { method: 'POST' });
  },

  logoutAll() {
    return request<{ message: string }>('/v1/auth/logout-all', { method: 'POST' });
  },

  refresh() {
    return request<{ message: string }>('/v1/auth/refresh', { method: 'POST' });
  },

  me() {
    return request<CurrentUserResponse>('/v1/me');
  },

  forgotPassword(email: string) {
    return request<{ message: string }>('/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(token: string, password: string) {
    return request<{ message: string }>('/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  switchWorkspace(workspace: WorkspaceType, organizationId?: string) {
    return request<CurrentUserResponse>('/v1/auth/workspace', {
      method: 'POST',
      body: JSON.stringify({ workspace, organizationId }),
    });
  },
};
