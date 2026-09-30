'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Building2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function AdminDefinicoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [companyName, setCompanyName] = useState('Atlas Materials');
  const [whatsappNumber, setWhatsappNumber] = useState('258874438819');
  const [contactEmail, setContactEmail] = useState('comercial@atlasmaterials.com');
  const [contactPhone, setContactPhone] = useState('+258 87 443 8819');
  const [address, setAddress] = useState('Maputo, Moçambique');

  useEffect(() => {
    // Initial fetch or defaults
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          whatsappNumber,
          contactEmail,
          contactPhone,
          address,
        }),
      });

      if (!res.ok) throw new Error('Falha ao guardar definições.');

      setToast({ type: 'success', text: 'Definições globais guardadas com sucesso!' });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Erro ao guardar definições.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
            : 'bg-red-950/80 border-red-600 text-red-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configurações Globais
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configuração de contactos comerciais, número do WhatsApp de atendimento e dados institucionais.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
        <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-3 flex items-center space-x-2">
          <Settings className="w-4 h-4 text-[#E8611C]" />
          <span>Canais de Atendimento e Contactos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#E8611C]" />
              <span>Nome Comercial da Empresa</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white focus:border-[#E8611C] outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Número de WhatsApp Comercial (com indicativo)</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ex: 258874438819"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white focus:border-[#E8611C] outline-none font-mono text-xs"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Usado para direcionar os botões de cotação direta no WhatsApp.
            </span>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>E-mail Comercial</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white focus:border-[#E8611C] outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>Telefone Fixo / Geral</span>
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white focus:border-[#E8611C] outline-none text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Morada / Showroom Principal</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white focus:border-[#E8611C] outline-none text-xs"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>A guardar...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Definições</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
