'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ExternalLink,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AdminNavLinks } from './admin-nav-links';

interface AdminLayoutShellProps {
  children: React.ReactNode;
  user: { name?: string; email?: string } | null;
}

export function AdminLayoutShell({ children, user }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoginPage && !user) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, router, user]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#141414] border-r border-zinc-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Branding */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-10 w-40 relative flex items-center">
                <Image
                  src="/logo.png"
                  alt="Atlas Materials Logo"
                  width={140}
                  height={38}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase tracking-widest">
              CMS
            </span>
          </div>

          {/* Navigation Links */}
          <div className="p-3">
            <AdminNavLinks />
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#111111] space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#E8611C]/20 border border-[#E8611C]/40 text-[#E8611C] flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || 'Administrador'}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'admin@atlasmaterials.com'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Ver Website</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>

            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-1 text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>{isLoggingOut ? 'A sair...' : 'Sair'}</span>
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-[#0E0E0E]">
        {children}
      </main>
    </div>
  );
}
