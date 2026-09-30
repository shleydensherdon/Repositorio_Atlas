import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Award, ArrowRight, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Marcas Representadas | Atlas Materials',
  description: 'Marcas de prestígio internacional distribuídas pela Atlas Materials: Atlas Prime, Atlas Cerâmica, Sanit Gold, HydroTech.',
};

export default async function MarcasPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Parcerias Globais
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Marcas & Fabricantes Parceiros
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Representamos marcas líderes mundiais em louça sanitária, cerâmica técnica e sistemas de torneiras monocomando.
          </p>
        </div>
      </section>

      {/* Grid de Marcas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-900 font-display group-hover:text-gold-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {brand.description || 'Linha selecionada com alto padrão de qualidade e garantia assegurada.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {brand._count.products} produtos
                </span>
                <Link
                  href={`/produtos?marca=${encodeURIComponent(brand.name)}`}
                  className="text-xs font-bold text-brand-900 hover:text-gold-600 flex items-center space-x-1"
                >
                  <span>Ver Coleção</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
