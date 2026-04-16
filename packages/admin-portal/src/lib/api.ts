import { getSession } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/v1`;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

async function getAuthToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken || null;
}

async function refreshToken(): Promise<string | null> {
  try {
    const session = await getSession();
    if (!session?.refreshToken) return null;

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: session.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new APIError(response.status, 'REFRESH_FAILED', 'Token refresh failed');
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    return null;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const headers = new Headers(fetchOptions.headers || {});

  if (!skipAuth) {
    let token = await getAuthToken();

    if (!token && !skipAuth) {
      // Try to refresh if no token
      token = await refreshToken();
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if (!headers.has('Content-Type') && fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new APIError(
          retryResponse.status,
          errorData.code || 'API_ERROR',
          errorData.message || `API Error: ${retryResponse.status}`
        );
      }

      return retryResponse.json();
    }

    throw new APIError(401, 'UNAUTHORIZED', 'Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      errorData.code || 'API_ERROR',
      errorData.message || `API Error: ${response.status}`
    );
  }

  return response.json();
}

export async function apiGet<T = any>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}
