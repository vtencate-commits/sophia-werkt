'use client';

import React, { useState, useEffect } from 'react';
import { apiGet, apiPut, apiPost, apiDelete } from '@/lib/api';

interface AISkill {
  id: string;
  name: string;
  description: string;
  category: string;
  tokenCost: number;
  isActive: boolean;
  usageCount: number;
  lastUsed: string | null;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<AISkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AISkill>>({});
  const [showNewSkillForm, setShowNewSkillForm] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    name: '',
    description: '',
    category: '',
    tokenCost: 100,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<{ skills: AISkill[] }>('/admin/skills');
      setSkills(data.skills);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load skills'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await apiPost('/admin/skills', newSkillData);
      setNewSkillData({
        name: '',
        description: '',
        category: '',
        tokenCost: 100,
      });
      setShowNewSkillForm(false);
      loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create skill'
      );
    }
  };

  const handleEditStart = (skill: AISkill) => {
    setEditingId(skill.id);
    setEditFormData({ ...skill });
  };

  const handleEditSave = async () => {
    if (!editingId) return;

    try {
      setError(null);
      await apiPut(`/admin/skills/${editingId}`, editFormData);
      loadSkills();
      setEditingId(null);
      setEditFormData({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update skill'
      );
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      setError(null);
      await apiPut(`/admin/skills/${id}`, { isActive: !isActive });
      loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update skill'
      );
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Bent u zeker dat u deze skill wilt verwijderen?')) {
      return;
    }

    try {
      setError(null);
      await apiDelete(`/admin/skills/${id}`);
      loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete skill'
      );
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Skills</h1>
          <p className="text-gray-600 mt-1">
            Beheer beschikbare AI-skills op het platform
          </p>
        </div>
        <button
          onClick={() => setShowNewSkillForm(!showNewSkillForm)}
          className="sophia-btn-primary"
        >
          {showNewSkillForm ? 'Annuleren' : 'Nieuwe skill'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Skill Form */}
      {showNewSkillForm && (
        <div className="sophia-card p-6">
          <h3 className="text-lg font-semibold mb-4">Nieuwe skill toevoegen</h3>
          <form onSubmit={handleCreateSkill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Naam"
              value={newSkillData.name}
              onChange={(e) =>
                setNewSkillData({ ...newSkillData, name: e.target.value })
              }
              className="sophia-input"
              required
            />
            <input
              type="text"
              placeholder="Categorie"
              value={newSkillData.category}
              onChange={(e) =>
                setNewSkillData({
                  ...newSkillData,
                  category: e.target.value,
                })
              }
              className="sophia-input"
              required
            />
            <textarea
              placeholder="Beschrijving"
              value={newSkillData.description}
              onChange={(e) =>
                setNewSkillData({
                  ...newSkillData,
                  description: e.target.value,
                })
              }
              className="sophia-input md:col-span-2"
              rows={3}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token kosten
              </label>
              <input
                type="number"
                min="1"
                value={newSkillData.tokenCost}
                onChange={(e) =>
                  setNewSkillData({
                    ...newSkillData,
                    tokenCost: parseInt(e.target.value),
                  })
                }
                className="sophia-input"
                required
              />
            </div>
            <button
              type="submit"
              className="sophia-btn-primary md:col-span-2"
            >
              Skill toevoegen
            </button>
          </form>
        </div>
      )}

      {/* Skills Table */}
      <div className="sophia-card overflow-x-auto">
        <table className="sophia-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Categorie</th>
              <th>Beschrijving</th>
              <th>Token kosten</th>
              <th>Gebruik</th>
              <th>Laatst gebruikt</th>
              <th>Status</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td className="font-medium">
                  {editingId === skill.id ? (
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="sophia-input text-sm"
                    />
                  ) : (
                    skill.name
                  )}
                </td>
                <td>
                  {editingId === skill.id ? (
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
                    skill.category
                  )}
                </td>
                <td className="text-sm text-gray-600 max-w-xs truncate">
                  {editingId === skill.id ? (
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
                    skill.description
                  )}
                </td>
                <td className="font-mono">
                  {editingId === skill.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editFormData.tokenCost || 0}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          tokenCost: parseInt(e.target.value),
                        })
                      }
                      className="sophia-input text-sm"
                    />
                  ) : (
                    skill.tokenCost
                  )}
                </td>
                <td className="text-sm">
                  {skill.usageCount} keer
                </td>
                <td className="text-sm text-gray-600">
                  {skill.lastUsed
                    ? new Date(skill.lastUsed).toLocaleDateString('nl-NL')
                    : 'Nooit'}
                </td>
                <td>
                  <span
                    className={
                      skill.isActive
                        ? 'sophia-badge sophia-badge-success'
                        : 'sophia-badge sophia-badge-danger'
                    }
                  >
                    {skill.isActive ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="space-x-2">
                  {editingId === skill.id ? (
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
                        onClick={() => handleEditStart(skill)}
                        className="sophia-btn sophia-btn-secondary text-xs"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() =>
                          handleToggleActive(skill.id, skill.isActive)
                        }
                        className={`sophia-btn text-xs ${
                          skill.isActive
                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {skill.isActive ? 'Deactiveer' : 'Activeer'}
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="sophia-btn sophia-btn-danger text-xs"
                      >
                        Verwijderen
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {skills.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen skills gevonden
          </div>
        )}
      </div>
    </div>
  );
}
