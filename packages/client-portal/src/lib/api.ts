const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
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
    const token = localStorage.getItem('accessToken');
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  let response = await fetch(url, {
    ...restOptions,
    headers: mergedHeaders,
  });

  if (response.status === 401 && !skipAuth) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
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
