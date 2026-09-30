import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FileText, Eye, CheckCircle2, Clock, MessageCircle, Paperclip } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminCotacoesPage() {
  const quotes = await prisma.quote.findMany({
    include: {
      items: true,
      attachments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pedidos de Cotação de Clientes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Total de {quotes.length} {quotes.length === 1 ? 'cotação recebida' : 'cotações recebidas'} via formulário web e calculadora.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            Nenhum pedido de cotação registado até ao momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1A1A] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3.5">Referência</th>
                  <th className="px-5 py-3.5">Data</th>
                  <th className="px-5 py-3.5">Cliente</th>
                  <th className="px-5 py-3.5">Empresa / Tipo</th>
                  <th className="px-5 py-3.5">Localização</th>
                  <th className="px-5 py-3.5">Itens & Fotos</th>
                  <th className="px-5 py-3.5">Total Estimado</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#E8611C]">
                      {q.referenceCode}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">
                      {new Date(q.createdAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">{q.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{q.customerPhone}</div>
                      <div className="text-[10px] text-zinc-500">{q.customerEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      <div>{q.companyName || 'Particular'}</div>
                      <div className="text-[10px] text-zinc-500">{q.projectType}</div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">
                      {q.location || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      <div className="font-semibold">{q.items.length} produtos</div>
                      {q.attachments.length > 0 && (
                        <div className="inline-flex items-center space-x-1 text-[10px] text-[#E8611C] font-bold mt-0.5">
                          <Paperclip className="w-3 h-3" />
                          <span>{q.attachments.length} foto(s) anexada(s)</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-white">
                      {formatCurrency(q.estimatedTotal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        q.status === 'NOVO'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : q.status === 'EM_ANALISE'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : q.status === 'RESPONDIDO'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : q.status === 'CONCLUIDO'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/cotacoes/${q.id}`}
                        className="inline-flex items-center space-x-1 bg-[#1E1E1E] hover:bg-[#E8611C] hover:text-white text-zinc-300 font-bold px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
