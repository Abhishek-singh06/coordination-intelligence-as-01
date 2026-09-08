'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ProjectType } from '@/lib/types';
import { generateBelievableProject } from '@/lib/dataGenerator';
import { X, Plus, Building2, MapPin } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, switchProject } = useStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('Commercial Office');
  const [location, setLocation] = useState('Central Business District');
  const [floors, setFloors] = useState(6);
  const [startDate, setStartDate] = useState('2026-09-01');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Use dynamic data generator for believable AEC project template
    const generated = generateBelievableProject(name, type, location, floors, startDate);

    const pid = createProject(
      generated.project,
      generated.stakeholders,
      generated.tasks,
      generated.dependencies
    );

    switchProject(pid);
    onClose();
  };

  const projectTypes: ProjectType[] = [
    'Retail Fit-Out',
    'Commercial Office',
    'Residential',
    'Hospitality',
    'Healthcare',
    'Industrial',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-aec-card border border-aec-border rounded-xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold">Create New AEC Project Workspace</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Orion Business Center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              >
                {projectTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Floors</label>
              <input
                type="number"
                min="1"
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Tower 3, CBD"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-aec-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-aec-bg hover:bg-slate-800 text-slate-300 rounded border border-aec-border text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 font-bold rounded text-xs border border-aec-rose/30"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
