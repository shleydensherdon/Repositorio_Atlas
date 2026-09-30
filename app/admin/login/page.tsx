'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      router.refresh();
      router.replace('/admin');
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar sessão.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 antialiased">
      {/* Glow effect */}
      <div className="absolute w-96 h-96 bg-[#E8611C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#141414] rounded-3xl p-8 shadow-2xl space-y-6 border border-zinc-800 relative z-10 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-3">
          <div className="h-12 w-48 mx-auto relative flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Atlas Materials"
              width={180}
              height={46}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Painel Administrativo
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Acesso exclusivo de gestão comercial e catálogo
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              E-mail de Administrador
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@atlasmaterials.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1D1D1D] border border-zinc-750 text-white placeholder-zinc-500 text-xs focus:border-[#E8611C] outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Palavra-passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1D1D1D] border border-zinc-750 text-white placeholder-zinc-500 text-xs focus:border-[#E8611C] outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#E8611C] hover:bg-[#C74E13] text-white font-bold text-xs shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A autenticar...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
