import React from 'react';
import { prisma } from '@/lib/prisma';
import { CatalogClient } from './catalog-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Catálogo de Produtos | Atlas Materials',
  description: 'Catálogo completo de louças sanitárias, porcelanatos, tijoleiras, portas e torneiras da Atlas Materials. Preços, especificações e calculadora de cotação.',
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams?: { categoria?: string; marca?: string; q?: string };
}) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { orderIndex: 'asc' },
  });

  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true } },
      images: { orderBy: { orderIndex: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-[#E8611C] uppercase tracking-widest">
            Catálogo Oficial de Materiais
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Produtos & Acabamentos de Alta Gama
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Explore a nossa gama de loiça sanitária, pisos porcelanatos, torneiras e portas. Adicione produtos à sua cotação ou use a calculadora de m².
          </p>
        </div>
      </section>

      {/* Main Interactive Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CatalogClient
          initialProducts={products}
          categories={categories}
          brands={brands}
          initialCategorySlug={searchParams?.categoria || ''}
        />
      </div>
    </div>
  );
}
