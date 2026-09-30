import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Categorias de Produtos | Atlas Materials',
  description: 'Conheça todas as categorias de materiais da Atlas Materials: Louça Sanitária, Portas, Tijoleiras e Porcelanatos, Torneiras e Misturadoras.',
};

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Linhas de Materiais
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Categorias de Produtos
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Soluções completas organizadas por áreas de aplicação para obras de qualquer dimensão.
          </p>
        </div>
      </section>

      {/* Grid de Categorias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.imageUrl || '/logo.png'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h2 className="text-2xl font-bold text-white font-display group-hover:text-gold-400 transition-colors">
                    {cat.name}
                  </h2>
                  <span className="text-xs text-slate-300 font-medium">
                    {cat._count.products} {cat._count.products === 1 ? 'produto registado' : 'produtos disponíveis'}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center justify-between font-bold text-sm text-brand-900 group-hover:text-gold-600">
                  <span>Ver Catálogo da Categoria</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
