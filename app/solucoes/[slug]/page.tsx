import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, Building2, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

interface SolutionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SolutionPageProps) {
  const solution = await prisma.solution.findUnique({
    where: { slug: params.slug },
  });

  if (!solution) return { title: 'Solução Não Encontrada | Atlas Materials' };

  return {
    title: `${solution.title} | Soluções Atlas Materials`,
    description: solution.shortDescription || 'Solução técnica especializada da Atlas Materials.',
  };
}

export default async function SolutionDetailPage({ params }: SolutionPageProps) {
  const solution = await prisma.solution.findUnique({
    where: { slug: params.slug },
  });

  if (!solution) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-900">Início</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/solucoes" className="hover:text-brand-900">Soluções</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">{solution.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
                Solução de Engenharia & Arquitetura
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-900 font-display">
                {solution.title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {solution.shortDescription}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-lg font-bold text-brand-900 font-display">
                Aplicações e Diferenciais Técnicos
              </h3>
              <p>
                A Atlas Materials assegura soluções de alto rendimento para {solution.title.toLowerCase()}, fornecendo produtos ensaiados segundo os mais rigorosos padrões de resistência, estanqueidade e durabilidade.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-brand-900 text-xs">Especificação Personalizada</div>
                  <div className="text-xs text-slate-500">Apoio técnico a projetistas e orçamentistas.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-brand-900 text-xs">Garantia Comprovada</div>
                  <div className="text-xs text-slate-500">Conformidade e assistência pós-venda.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-brand-900 text-white shadow-xl space-y-4">
              <h3 className="text-lg font-bold font-display">
                Solicitar Cotação para esta Solução
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A nossa equipa técnica pode analisar os mapas de quantidades do seu projeto e preparar uma proposta comercial à medida.
              </p>
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  href="/cotacao"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 text-brand-950 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow"
                >
                  <span>Pedir Orçamento Formal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/258874438819?text=${encodeURIComponent(
                    `Olá Atlas Materials! Gostaria de esclarecimentos técnicos sobre a solução: ${solution.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Falar com Especialista WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
