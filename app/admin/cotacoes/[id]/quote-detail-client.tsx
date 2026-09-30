'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FileText, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  MessageCircle, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Paperclip,
  Calculator,
  Download
} from 'lucide-react';
import { formatCurrency, formatArea } from '@/lib/utils';

interface QuoteDetailClientProps {
  quote: {
    id: string;
    referenceCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerWhatsapp?: string | null;
    companyName?: string | null;
    projectType?: string | null;
    location?: string | null;
    notes?: string | null;
    status: string;
    estimatedTotal: number | null;
    createdAt: Date | string;
    items: Array<{
      id: string;
      productName: string;
      quantity: number;
      unit: string;
      calculatedArea?: number | null;
      wastePercentage?: number | null;
      unitPrice?: number | null;
      subtotal?: number | null;
    }>;
    attachments: Array<{
      id: string;
      fileUrl: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    }>;
  };
}

export function QuoteDetailClient({ quote }: QuoteDetailClientProps) {
  const [status, setStatus] = useState(quote.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setIsUpdatingStatus(true);
    try {
      await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const customerWhatsappClean = (quote.customerWhatsapp || quote.customerPhone).replace(/[^0-9]/g, '');
  const replyMsg = `Olá ${quote.customerName}! Entramos em contacto da Atlas Materials referente ao seu pedido de cotação *${quote.referenceCode}*.`;
  const whatsappUrl = `https://wa.me/${customerWhatsappClean}?text=${encodeURIComponent(replyMsg)}`;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/cotacoes"
            className="p-2.5 rounded-xl bg-[#1E1E1E] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                Cotação <span className="font-mono text-[#E8611C]">#{quote.referenceCode}</span>
              </h1>
              <span className="text-xs font-mono text-zinc-400">
                {new Date(quote.createdAt).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-zinc-400 font-semibold">Estado do Pedido:</span>
          <select
            value={status}
            disabled={isUpdatingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-[#1E1E1E] text-xs font-bold text-white outline-none focus:border-[#E8611C]"
          >
            <option value="NOVO">NOVO</option>
            <option value="EM_ANALISE">EM ANÁLISE</option>
            <option value="RESPONDIDO">RESPONDIDO</option>
            <option value="CONCLUIDO">CONCLUÍDO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer & Project Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#141414] p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2.5 flex items-center space-x-2">
              <User className="w-4 h-4 text-[#E8611C]" />
              <span>Dados do Cliente</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <User className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">{quote.customerName}</div>
                  {quote.companyName && (
                    <div className="text-zinc-400">{quote.companyName}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="font-semibold text-zinc-200">{quote.customerPhone}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-300">{quote.customerEmail}</span>
              </div>

              {quote.location && (
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{quote.location}</span>
                </div>
              )}

              {quote.projectType && (
                <div className="flex items-center space-x-2.5">
                  <Building2 className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">Tipo: {quote.projectType}</span>
                </div>
              )}
            </div>

            {quote.notes && (
              <div className="pt-3 border-t border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Notas do Cliente:
                </span>
                <p className="text-xs text-zinc-300 bg-[#1D1D1D] p-3 rounded-xl border border-zinc-750 italic leading-relaxed">
                  &ldquo;{quote.notes}&rdquo;
                </p>
              </div>
            )}

            {/* Quick WhatsApp Action */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar Cliente no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Quoted Items Table & Attached Pictures */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#141414] rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                Produtos Solicitados ({quote.items.length})
              </h3>
              <div className="text-sm font-extrabold text-[#E8611C]">
                Total Estimado: {formatCurrency(quote.estimatedTotal)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1A1A] text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-3">Produto</th>
                    <th className="px-5 py-3">Qtd / Metragem</th>
                    <th className="px-5 py-3">Preço Unitário</th>
                    <th className="px-5 py-3 text-right">Subtotal Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3.5 font-bold text-white">
                        {item.productName}
                        {item.calculatedArea && (
                          <div className="text-[11px] font-normal text-[#E8611C] flex items-center space-x-1 mt-0.5">
                            <Calculator className="w-3 h-3" />
                            <span>Calculado: {formatArea(item.calculatedArea)} (+{item.wastePercentage}% corte)</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-300">
                        {item.calculatedArea ? formatArea(item.calculatedArea) : `${item.quantity} ${item.unit}`}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5 font-extrabold text-white text-right">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attached Customer Pictures */}
          {quote.attachments.length > 0 && (
            <div className="bg-[#141414] rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <Paperclip className="w-4 h-4 text-[#E8611C]" />
                <h3 className="font-bold text-white text-sm">
                  Fotografias & Ficheiros do Projeto Anexados pelo Cliente ({quote.attachments.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quote.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="group relative rounded-xl border border-zinc-800 overflow-hidden bg-[#1E1E1E] aspect-square shadow-sm"
                  >
                    <Image
                      src={att.fileUrl}
                      alt={att.fileName}
                      fill
                      className="object-cover"
                    />
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                    >
                      <span>Abrir Foto ↗</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
