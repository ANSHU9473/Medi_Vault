'use client';
import { useState, useEffect } from 'react';
import { X, Folder } from 'lucide-react';

export default function CreateFolderModal({ open, onClose, onCreated, editFolder }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#0d9488');

  useEffect(() => {
    if (open) {
      if (editFolder) {
        setName(editFolder.name);
        setIcon(editFolder.icon || '📁');
        setColor(editFolder.color || '#0d9488');
      } else {
        setName('');
        setIcon('📁');
        setColor('#0d9488');
      }
    }
  }, [open, editFolder]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreated({ name, icon, color });
    onClose();
  };

  const presetColors = ['#4c8bf5', '#5a8a7a', '#5b73a0', '#7a6e9e', '#c0392b', '#8c6d4f', '#2d6a4f'];
  const presetIcons = ['📁', '🏥', '💊', '🧬', '🦷', '👁️', '🧾'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface-800 border border-surface-700/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-surface-700/40">
          <h2 className="text-xl font-semibold text-white">
            {editFolder ? 'Edit Folder' : 'Create New Folder'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Blood Tests 2024"
              className="w-full px-4 py-3 bg-surface-800 border border-surface-700/60 rounded-xl text-white placeholder-surface-400 transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
            <div className="flex gap-2">
              {presetIcons.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setIcon(preset)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${icon === preset ? 'bg-surface-700 border-2 border-primary-500/60' : 'bg-surface-800 border border-surface-700/60 hover:border-surface-500'}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Color Accent</label>
            <div className="flex gap-2">
              {presetColors.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-8 h-8 rounded-full transition-all ${color === preset ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-surface-700/60 text-surface-300 font-medium rounded-xl hover:bg-surface-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Folder size={18} />
              {editFolder ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
