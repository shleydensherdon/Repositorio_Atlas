import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductActions } from './product-actions';
import { formatCurrency } from '@/lib/utils';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  ArrowLeft,
  Ruler,
  Layers
} from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { brand: true, category: true },
  });

  if (!product) return { title: 'Produto Não Encontrado | Atlas Materials' };

  return {
    title: `${product.name} | Atlas Materials`,
    description: product.shortDescription || product.description || 'Produto de alta qualidade da Atlas Materials.',
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { orderIndex: 'asc' } },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: { select: { name: true, slug: true } },
      brand: { select: { name: true } },
      images: { orderBy: { orderIndex: 'asc' } },
    },
    take: 3,
  });

  // Parse technical specs
  let specs: Record<string, string> = {};
  if (product.technicalSpecs) {
    try {
      specs = JSON.parse(product.technicalSpecs);
    } catch (e) {}
  }

  const primaryImage = product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || '/logo.png';

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto">
          <Link href="/" className="hover:text-brand-900 shrink-0">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/produtos" className="hover:text-brand-900 shrink-0">Catálogo</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href={`/categorias/${product.category.slug}`} className="hover:text-brand-900 shrink-0">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-slate-900 truncate shrink-0 max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {product.brand && (
                  <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
                    {product.brand.name}
                  </span>
                )}
                {product.sku && (
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 font-display leading-snug">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  {product.isPerSquareMeter ? 'Preço por Metro Quadrado' : 'Valor Indicativo'}
                </span>
                <div className="text-2xl font-extrabold text-brand-900 font-display">
                  {formatCurrency(product.price)}
                  {product.isPerSquareMeter && <span className="text-sm font-medium text-slate-500"> /m²</span>}
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>{product.isAvailable ? 'Em Stock / Pronta Entrega' : 'Sob Encomenda'}</span>
              </div>
            </div>

            {/* Dimensions Badge if available */}
            {product.dimensions && (
              <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Ruler className="w-4 h-4 text-gold-600" />
                <span className="font-semibold">Dimensões / Medidas:</span>
                <span>{product.dimensions}</span>
              </div>
            )}

            {/* Interactive Actions (Quantity, Tile Calculator & Add to Quote) */}
            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                price: product.price,
                unit: product.unit,
                isPerSquareMeter: product.isPerSquareMeter,
                dimensions: product.dimensions,
                isAvailable: product.isAvailable,
                imageUrl: primaryImage,
              }}
            />

            {/* Guarantees Box */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-5 h-5 text-brand-900 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Garantia Técnica Atlas</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <Truck className="w-5 h-5 text-brand-900 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Entrega Rápida em Obra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description and Technical Specs */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-brand-900 font-display">
              Descrição do Produto
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>{product.description || 'Produto de acabamento premium com excelente padrão de durabilidade e conformidade técnica.'}</p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-bold text-brand-900 font-display">
              Especificações Técnicas
            </h3>
            {Object.keys(specs).length > 0 ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="p-3.5 flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">{key}:</span>
                    <span className="font-bold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 border border-slate-200">
                Especificações adicionais disponíveis no momento da cotação formal.
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-brand-900 font-display">
                Produtos Relacionados
              </h3>
              <Link
                href="/produtos"
                className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center space-x-1"
              >
                <span>Ver Catálogo Completo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.name}
                  slug={rel.slug}
                  sku={rel.sku}
                  price={rel.price}
                  unit={rel.unit}
                  isPerSquareMeter={rel.isPerSquareMeter}
                  dimensions={rel.dimensions}
                  isAvailable={rel.isAvailable}
                  isFeatured={rel.isFeatured}
                  category={rel.category}
                  brand={rel.brand}
                  images={rel.images}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
