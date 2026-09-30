import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Building2, Sparkles, Bath, DoorClosed, Droplets, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Soluções Técnicas & Construtivas | Atlas Materials',
  description: 'Soluções integradas da fundação aos acabamentos: Louça sanitária, caixilharia, impermeabilização, pisos e torneiras.',
};

export default async function SolucoesPage() {
  const solutions = await prisma.solution.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Engenharia & Arquitetura
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Soluções Atlas Materials
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Soluções completas concebidas para assegurar durabilidade estrutural, conformidade normativa e elevado apelo estético.
          </p>
        </div>
      </section>

      {/* Grid de Soluções */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-brand-700 transition-colors">
                  {sol.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {sol.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/solucoes/${sol.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-900 hover:text-gold-600"
                >
                  <span>Ver Especificações Técnicas</span>
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
