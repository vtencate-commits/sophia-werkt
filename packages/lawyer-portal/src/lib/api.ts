import { getAuthToken, setAuthToken, clearAuthToken } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/v1`

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function refreshToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      setAuthToken(data.accessToken)
      return data.accessToken
    }

    clearAuthToken()
    return null
  } catch {
    clearAuthToken()
    return null
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {})

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  headers.set('Content-Type', 'application/json')

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 401) {
    const newToken = await refreshToken()
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      })
    } else {
      throw new ApiError(401, 'Authentication failed')
    }
  }

  const contentType = response.headers.get('content-type')
  let data: unknown

  if (contentType?.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.statusText}`, data)
  }

  return data as T
}

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

export async function apiPost<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiPut<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiPatch<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}
