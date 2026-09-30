import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Calendar, Building2, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Projetos e Obras Fornecidas | Atlas Materials',
  description: 'Conheça os projetos e empreendimentos residenciais, comerciais e hoteleiros fornecidos pela Atlas Materials.',
};

export default async function ProjetosPage() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,97,28,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-[#E8611C] uppercase tracking-widest">
            Histórico de Fornecimento
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Projetos & Obras Realizadas
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Uma seleção de empreendimentos residenciais de luxo e centros corporativos construídos com materiais Atlas.
          </p>
        </div>
      </section>

      {/* Grid de Projetos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => {
            const cover = proj.coverImage || proj.images[0]?.imageUrl || '/logo.png';

            return (
              <Link
                key={proj.id}
                href={`/projetos/${proj.slug}`}
                className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col group"
              >
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={cover}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {proj.category && (
                    <div className="absolute top-3 left-3 bg-brand-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {proj.category}
                    </div>
                  )}
                  {proj.isFeatured && (
                    <div className="absolute top-3 right-3 bg-[#E8611C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Destaque</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      {proj.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E8611C]" />
                          <span>{proj.location}</span>
                        </span>
                      )}
                      {proj.date && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#E8611C]" />
                          <span>{proj.date}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-[#E8611C] transition-colors">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {proj.description || 'Clique para ver as fotos e materiais desta obra.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#E8611C]">
                    <span>Ver Detalhes do Projeto</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
