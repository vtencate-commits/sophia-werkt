const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/v1`;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export async function fetchApiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers, ...restOptions } = options;

  const url = `${API_URL}${endpoint}`;
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  let response = await fetch(url, {
    ...restOptions,
    headers: mergedHeaders,
  });

  if (response.status === 401 && !skipAuth) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setTokens(data.accessToken, data.refreshToken);
          mergedHeaders['Authorization'] = `Bearer ${data.accessToken}`;

          response = await fetch(url, {
            ...restOptions,
            headers: mergedHeaders,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    fetchApiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchApiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchApiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchApiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    fetchApiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
