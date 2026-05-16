'use client';
import { useState, useEffect } from 'react';
import { Save, AlertTriangle, Heart, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    bloodType: '',
    allergies: '',
    medications: '',
    emergencyContact: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile({
              bloodType: data.profile.bloodType || '',
              allergies: data.profile.allergies || '',
              medications: data.profile.medications || '',
              emergencyContact: data.profile.emergencyContact || '',
              notes: data.profile.notes || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergencyProfile: profile })
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Emergency profile saved successfully!');
        // Refresh the page data so the widget in sidebar updates
        router.refresh();
      } else {
        console.error('Save failed:', data);
        showToast('error', data.error || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', 'Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-red-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5 shrink-0" />
              : <XCircle className="w-5 h-5 shrink-0" />
            }
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Emergency Profile</h1>
          <p className="text-slate-400">Critical medical information accessible by first responders</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Heart size={16} className="text-red-400" />
              Blood Type
            </label>
            <select 
              value={profile.bloodType}
              onChange={e => setProfile({...profile, bloodType: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Select Blood Type</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Activity size={16} className="text-orange-400" />
              Emergency Contact (Name & Number)
            </label>
            <input 
              type="text"
              value={profile.emergencyContact}
              onChange={e => setProfile({...profile, emergencyContact: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g., Jane Doe - 555-0192"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Known Allergies</label>
          <textarea 
            value={profile.allergies}
            onChange={e => setProfile({...profile, allergies: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-red-500 transition-colors resize-none"
            placeholder="List all severe allergies (e.g., Penicillin, Peanuts)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Current Medications & Dosages</label>
          <textarea 
            value={profile.medications}
            onChange={e => setProfile({...profile, medications: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-red-500 transition-colors resize-none"
            placeholder="e.g., Lisinopril 10mg daily"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Additional Instructions / Conditions</label>
          <textarea 
            value={profile.notes}
            onChange={e => setProfile({...profile, notes: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-red-500 transition-colors resize-none"
            placeholder="Pacemaker, Diabetes Type 1, etc."
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Emergency Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
