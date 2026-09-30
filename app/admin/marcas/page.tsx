import React from 'react';
import { prisma } from '@/lib/prisma';
import { Award, Plus, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminMarcasPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Marcas & Linhas Parceiras
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de marcas representadas pela Atlas Materials
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Marca</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Descrição</th>
                <th className="px-5 py-3.5">Total de Produtos</th>
                <th className="px-5 py-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{b.name}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{b.slug}</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-sm truncate">{b.description || '—'}</td>
                  <td className="px-5 py-3.5 font-bold text-brand-900">{b._count.products} produtos</td>
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
