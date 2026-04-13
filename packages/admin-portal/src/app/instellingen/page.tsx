'use client';

import React, { useState, useEffect } from 'react';
import { apiGet, apiPut } from '@/lib/api';

interface PlatformSettings {
  id: string;
  platformName: string;
  supportEmail: string;
  maxCasesPerLawyer: number;
  invoiceDueDays: number;
  aiTokenLimit: number;
  enableTwoFactor: boolean;
  enableAuditLog: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function InstellingenPage() {
  const [, setSettings] = useState<PlatformSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<PlatformSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<{ settings: PlatformSettings }>(
        '/admin/settings'
      );
      setSettings(data.settings);
      setFormData(data.settings);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load settings'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiPut('/admin/settings', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save settings'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-600 mt-1">
          Configureer platform instellingen
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Instellingen succesvol opgeslagen
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="sophia-card p-6">
          <h2 className="text-xl font-semibold mb-4">Algemeen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform naam
              </label>
              <input
                type="text"
                value={formData.platformName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platformName: e.target.value,
                  })
                }
                className="sophia-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support e-mail
              </label>
              <input
                type="email"
                value={formData.supportEmail || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supportEmail: e.target.value,
                  })
                }
                className="sophia-input"
              />
            </div>
          </div>
        </div>

        {/* Case & Invoice Settings */}
        <div className="sophia-card p-6">
          <h2 className="text-xl font-semibold mb-4">Zaken en facturatie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max zaken per advocaat
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxCasesPerLawyer || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCasesPerLawyer: parseInt(e.target.value),
                  })
                }
                className="sophia-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factuurdagen vervaldatum
              </label>
              <input
                type="number"
                min="1"
                value={formData.invoiceDueDays || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invoiceDueDays: parseInt(e.target.value),
                  })
                }
                className="sophia-input"
              />
            </div>
          </div>
        </div>

        {/* AI & Token Settings */}
        <div className="sophia-card p-6">
          <h2 className="text-xl font-semibold mb-4">AI & Tokens</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Token limiet per dag
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={formData.aiTokenLimit || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aiTokenLimit: parseInt(e.target.value),
                })
              }
              className="sophia-input"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="sophia-card p-6">
          <h2 className="text-xl font-semibold mb-4">Beveiliging</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableTwoFactor || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableTwoFactor: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700">
                Twee-factor authenticatie vereist
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableAuditLog || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableAuditLog: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700">
                Audit log inschakelen
              </span>
            </label>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="sophia-card p-6">
          <h2 className="text-xl font-semibold mb-4">Onderhoudsmodus</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maintenanceMode || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maintenanceMode: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700">
                Onderhoudsmodus inschakelen
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onderhouds bericht
              </label>
              <textarea
                value={formData.maintenanceMessage || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maintenanceMessage: e.target.value,
                  })
                }
                className="sophia-input"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="sophia-btn-primary"
          >
            {isSaving ? 'Opslaan...' : 'Instellingen opslaan'}
          </button>
          <button
            type="button"
            onClick={loadSettings}
            className="sophia-btn-secondary"
          >
            Herstellen
          </button>
        </div>
      </form>
    </div>
  );
}
