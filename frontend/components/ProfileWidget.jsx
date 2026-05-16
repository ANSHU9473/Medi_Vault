'use client';
import { useState, useEffect } from 'react';
import { Heart, Activity, AlertTriangle, Phone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProfileWidget() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.profile || null);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('ProfileWidget load error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="glass rounded-3xl p-6 h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-6 sticky top-6 border border-surface-700/50"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-surface-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Emergency Profile
                </h2>
                <Link href="/dashboard/profile" className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
                    Edit
                </Link>
            </div>

            {error ? (
                <div className="text-center py-6">
                    <p className="text-xs text-surface-secondary mb-3">Could not load profile. Check connection.</p>
                    <Link href="/dashboard/profile" className="px-4 py-2 bg-surface-700 text-surface-foreground rounded-lg text-sm hover:bg-surface-600 transition-colors inline-block font-medium">
                        Open Profile
                    </Link>
                </div>
            ) : !profile ? (
                <div className="text-center py-6">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
                    <p className="text-sm text-surface-secondary mb-4">No emergency profile setup yet.</p>
                    <Link href="/dashboard/profile" className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition-colors inline-block font-medium">
                        Setup Profile
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Blood Type */}
                    <div className="flex items-center gap-4 bg-surface-800/40 p-3 rounded-2xl border border-surface-700/30">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-surface-secondary font-bold">Blood Type</p>
                            <p className="text-sm font-bold text-surface-foreground">
                                {profile.bloodType || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="flex items-center gap-4 bg-surface-800/40 p-3 rounded-2xl border border-surface-700/30">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] uppercase tracking-wider text-surface-secondary font-bold">Emergency Contact</p>
                            <p className="text-sm font-bold text-surface-foreground truncate">
                                {profile.emergencyContact || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="flex items-start gap-4 bg-surface-800/40 p-3 rounded-2xl border border-surface-700/30">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-surface-secondary font-bold mb-1">Allergies</p>
                            <p className="text-xs text-surface-secondary leading-relaxed font-medium">
                                {profile.allergies || 'None known'}
                            </p>
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="flex items-start gap-4 bg-surface-800/40 p-3 rounded-2xl border border-surface-700/30">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0 mt-0.5">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-surface-secondary font-bold mb-1">Medications</p>
                            <p className="text-xs text-surface-secondary leading-relaxed font-medium">
                                {profile.medications || 'None'}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {profile.notes && (
                        <div className="flex items-start gap-4 bg-surface-800/40 p-3 rounded-2xl border border-surface-700/30">
                            <div className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-surface-secondary shrink-0 mt-0.5">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-surface-secondary font-bold mb-1">Additional Notes</p>
                                <p className="text-xs text-surface-secondary leading-relaxed font-medium italic">
                                    "{profile.notes}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
