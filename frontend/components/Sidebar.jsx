'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, X, Shield } from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Emergency Profile', href: '/dashboard/profile', icon: Activity },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-surface-800 border-r border-surface-700/60
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-700/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center">
              <Shield size={16} className="text-primary-400" />
            </div>
            <span className="text-lg font-bold text-white">
              Medi<span className="text-primary-400">Vault</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-surface-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 mt-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm
                  ${isActive
                    ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                    : 'text-surface-300 hover:bg-surface-700/50 hover:text-white border border-transparent'}
                `}
                onClick={() => onClose?.()}
              >
                <Icon size={18} className={isActive ? 'text-primary-400' : 'text-surface-400'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full px-6 py-4 border-t border-surface-700/40 text-xs text-surface-400 text-center">
          © {new Date().getFullYear()} MediVault
        </div>
      </aside>
    </>
  );
}
