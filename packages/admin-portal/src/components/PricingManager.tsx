'use client';

import React, { useState, useEffect } from 'react';
import { apiGet, apiPut } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface AdviceType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  category: string;
}

interface PricingManagerProps {
  onPricingUpdated?: () => void;
}

export function PricingManager({ onPricingUpdated }: PricingManagerProps) {
  const [adviceTypes, setAdviceTypes] = useState<AdviceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AdviceType>>({});

  useEffect(() => {
    loadAdviceTypes();
  }, []);

  const loadAdviceTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<{ adviceTypes: AdviceType[] }>('/admin/advice-types');
      setAdviceTypes(data.adviceTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = (adviceType: AdviceType) => {
    setEditingId(adviceType.id);
    setEditFormData({ ...adviceType });
  };

  const handleEditSave = async () => {
    if (!editingId) return;

    try {
      setError(null);
      await apiPut(`/admin/advice-types/${editingId}`, editFormData);
      loadAdviceTypes();
      setEditingId(null);
      setEditFormData({});
      onPricingUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pricing');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      setError(null);
      await apiPut(`/admin/advice-types/${id}`, { isActive: !isActive });
      loadAdviceTypes();
      onPricingUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pricing');
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

      <div className="sophia-card overflow-x-auto">
        <table className="sophia-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Categorie</th>
              <th>Beschrijving</th>
              <th>Basisbedrag</th>
              <th>Status</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {adviceTypes.map((adviceType) => (
              <React.Fragment key={adviceType.id}>
                <tr>
                  <td className="font-medium">
                    {editingId === adviceType.id ? (
                      <input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, name: e.target.value })
                        }
                        className="sophia-input text-sm"
                      />
                    ) : (
                      adviceType.name
                    )}
                  </td>
                  <td>
                    {editingId === adviceType.id ? (
                      <input
                        type="text"
                        value={editFormData.category || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            category: e.target.value,
                          })
                        }
                        className="sophia-input text-sm"
                      />
                    ) : (
                      adviceType.category
                    )}
                  </td>
                  <td>
                    {editingId === adviceType.id ? (
                      <input
                        type="text"
                        value={editFormData.description || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        className="sophia-input text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        {adviceType.description}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === adviceType.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.basePrice || 0}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            basePrice: parseFloat(e.target.value),
                          })
                        }
                        className="sophia-input text-sm"
                      />
                    ) : (
                      <span className="font-medium">
                        {formatCurrency(adviceType.basePrice)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={
                        adviceType.isActive
                          ? 'sophia-badge sophia-badge-success'
                          : 'sophia-badge sophia-badge-danger'
                      }
                    >
                      {adviceType.isActive ? 'Actief' : 'Inactief'}
                    </span>
                  </td>
                  <td className="space-x-2">
                    {editingId === adviceType.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="sophia-btn sophia-btn-primary text-xs"
                        >
                          Opslaan
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditFormData({});
                          }}
                          className="sophia-btn sophia-btn-secondary text-xs"
                        >
                          Annuleren
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(adviceType)}
                          className="sophia-btn sophia-btn-secondary text-xs"
                        >
                          Bewerken
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(adviceType.id, adviceType.isActive)
                          }
                          className={`sophia-btn text-xs ${
                            adviceType.isActive
                              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {adviceType.isActive ? 'Deactiveer' : 'Activeer'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
