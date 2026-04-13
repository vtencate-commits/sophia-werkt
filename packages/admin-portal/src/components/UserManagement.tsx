'use client';

import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'LAWYER' | 'ADMIN' | 'CLIENT';
  twoFactorEnabled: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface UserManagementProps {
  onUserUpdated?: () => void;
}

export function UserManagement({ onUserUpdated }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string; role: string }>({
    name: '',
    email: '',
    role: 'LAWYER',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<{ users: User[] }>('/admin/users');
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await apiPost('/admin/users', formData);
      setFormData({ name: '', email: '', role: 'LAWYER' });
      loadUsers();
      onUserUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError(null);
      await apiPut(`/admin/users/${selectedUser.id}`, formData);
      setIsEditingUser(false);
      setSelectedUser(null);
      loadUsers();
      onUserUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleToggleActivation = async (userId: string, isActive: boolean) => {
    try {
      setError(null);
      await apiPut(`/admin/users/${userId}`, { isActive: !isActive });
      loadUsers();
      onUserUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bent u zeker dat u deze gebruiker wilt verwijderen?')) {
      return;
    }

    try {
      setError(null);
      await apiDelete(`/admin/users/${userId}`);
      loadUsers();
      onUserUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="sophia-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isEditingUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker'}
        </h3>
        <form
          onSubmit={isEditingUser ? handleUpdateUser : handleCreateUser}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Naam"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="sophia-input"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="sophia-input"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            className="sophia-input"
          >
            <option value="LAWYER">Advocaat</option>
            <option value="ADMIN">Admin</option>
            <option value="CLIENT">Client</option>
          </select>
          <button
            type="submit"
            className="sophia-btn-primary md:col-span-3"
          >
            {isEditingUser ? 'Opslaan' : 'Maken'}
          </button>
          {isEditingUser && (
            <button
              type="button"
              onClick={() => {
                setIsEditingUser(false);
                setSelectedUser(null);
              }}
              className="sophia-btn-secondary md:col-span-3"
            >
              Annuleren
            </button>
          )}
        </form>
      </div>

      <div className="sophia-card overflow-x-auto">
        <table className="sophia-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>E-mail</th>
              <th>Rol</th>
              <th>2FA</th>
              <th>Status</th>
              <th>Laatste ingang</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="sophia-badge sophia-badge-info">
                    {user.role === 'LAWYER'
                      ? 'Advocaat'
                      : user.role === 'ADMIN'
                        ? 'Admin'
                        : 'Client'}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      user.twoFactorEnabled
                        ? 'sophia-badge sophia-badge-success'
                        : 'sophia-badge sophia-badge-danger'
                    }
                  >
                    {user.twoFactorEnabled ? 'Ingeschakeld' : 'Uitgeschakeld'}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      user.isActive
                        ? 'sophia-badge sophia-badge-success'
                        : 'sophia-badge sophia-badge-danger'
                    }
                  >
                    {user.isActive ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {user.lastLogin ? formatDateTime(user.lastLogin) : 'Nooit'}
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                      });
                      setIsEditingUser(true);
                    }}
                    className="sophia-btn sophia-btn-secondary text-xs"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleToggleActivation(user.id, user.isActive)}
                    className={`sophia-btn text-xs ${
                      user.isActive
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? 'Deactiveer' : 'Activeer'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="sophia-btn sophia-btn-danger text-xs"
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
