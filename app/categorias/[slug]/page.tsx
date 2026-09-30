import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { ChevronRight, Layers, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: 'Categoria Não Encontrada | Atlas Materials' };

  return {
    title: `${category.name} | Catálogo Atlas Materials`,
    description: category.description || `Produtos da categoria ${category.name} na Atlas Materials.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } },
          images: { orderBy: { orderIndex: 'asc' } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-900">Início</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/categorias" className="hover:text-brand-900">Categorias</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">{category.name}</span>
        </div>
      </div>

      {/* Category Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-brand-800">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Linha de Produtos
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
              {category.name}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              {category.description}
            </p>
            <div className="text-xs font-semibold text-gold-400 pt-2">
              {category.products.length} {category.products.length === 1 ? 'modelo disponível para cotação' : 'modelos disponíveis para cotação'}
            </div>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-900 font-display">
            Produtos em {category.name}
          </h2>
          <Link
            href="/produtos"
            className="text-xs font-bold text-slate-600 hover:text-brand-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Todos os Produtos</span>
          </Link>
        </div>

        {category.products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">Nenhum produto cadastrado nesta categoria no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.products.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                sku={prod.sku}
                price={prod.price}
                unit={prod.unit}
                isPerSquareMeter={prod.isPerSquareMeter}
                dimensions={prod.dimensions}
                isAvailable={prod.isAvailable}
                isFeatured={prod.isFeatured}
                category={prod.category}
                brand={prod.brand}
                images={prod.images}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
