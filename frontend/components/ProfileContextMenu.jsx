'use client';
import { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ProfileContextMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = session?.user?.name || 'User';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20">
          {initial}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30">
            <p className="text-sm font-semibold text-white line-clamp-1">{userName}</p>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{session?.user?.email || 'email@example.com'}</p>
            {session?.user?.accountType && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full border border-teal-500/20 capitalize">
                {session.user.accountType}
              </span>
            )}
          </div>
          
          <div className="p-2 space-y-1">
            <Link 
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <User size={16} />
              My Profile
            </Link>
            <Link 
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Settings size={16} />
              Settings
            </Link>
          </div>
          
          <div className="p-2 border-t border-slate-800">
            <button 
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut size={16} />
              Sign Out Securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
