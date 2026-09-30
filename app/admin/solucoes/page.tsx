import React from 'react';
import { prisma } from '@/lib/prisma';
import { Sparkles, Building2, Plus, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSolucoesPage() {
  const solutions = await prisma.solution.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Soluções Técnicas Atlas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de áreas de especialização e engenharia
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Título</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Resumo</th>
                <th className="px-5 py-3.5">Ordem</th>
                <th className="px-5 py-3.5">Destaque</th>
                <th className="px-5 py-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {solutions.map((sol) => (
                <tr key={sol.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{sol.title}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">/{sol.slug}</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-sm truncate">{sol.shortDescription}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">#{sol.orderIndex}</td>
                  <td className="px-5 py-3.5">
                    {sol.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 text-[10px] font-bold">
                        Sim
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
