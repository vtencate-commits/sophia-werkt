'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, verifyTwoFactor, session } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (session?.accessToken) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      setShowTwoFactorInput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await verifyTwoFactor(twoFactorCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="sophia-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sophia Werkt
          </h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!showTwoFactorInput ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mailaddres
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sophia-input"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sophia-input"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="sophia-btn-primary w-full"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twee-factor authenticatie code
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Voer de 6-cijferige code in van uw authenticatie app
              </p>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.slice(0, 6))}
                className="sophia-input text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || twoFactorCode.length !== 6}
              className="sophia-btn-primary w-full"
            >
              {isLoading ? 'Verifiëren...' : 'Verifiëren'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowTwoFactorInput(false);
                setEmail('');
                setPassword('');
                setTwoFactorCode('');
              }}
              className="sophia-btn-secondary w-full"
            >
              Terug naar inloggen
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Contacteer support als u geen toegang hebt
        </p>
      </div>
    </div>
  );
}
