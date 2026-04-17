'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPERADMIN';
  accessToken: string;
  refreshToken: string;
  twoFactorEnabled: boolean;
  expiresAt: number;
}

interface AuthContextType {
  session: AdminSession | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'sophia_admin_session';

// Server-side session getter
export async function getSession(): Promise<AdminSession | null> {
  try {
    // In a real app, this would fetch from a secure server session
    // For now, we'll use client-side storage as fallback
    if (typeof window === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load session from storage
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const parsedSession = JSON.parse(stored);
        // Check if token is expired
        if (parsedSession.expiresAt > Date.now()) {
          setSession(parsedSession);
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Decode JWT payload to get user info
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));

      if (payload.role !== 'ADMIN') {
        throw new Error('Geen admin rechten. Alleen beheerders kunnen hier inloggen.');
      }

      const sessionData: AdminSession = {
        id: payload.userId,
        email: payload.email,
        name: payload.email,
        role: payload.role as 'ADMIN' | 'SUPERADMIN',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        twoFactorEnabled: false,
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (code: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/admin/verify-2fa`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session?.email,
            code,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();

      const sessionData: AdminSession = {
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        twoFactorEnabled: data.admin.twoFactorEnabled,
        expiresAt: Date.now() + 3600000,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setSession(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        error,
        login,
        logout,
        verifyTwoFactor,
        isAuthenticated: !!session?.accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
