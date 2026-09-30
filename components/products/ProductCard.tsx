'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Eye, 
  Calculator, 
  Check, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { formatCurrency } from '@/lib/utils';
import { TileCalculator } from '@/components/calculator/TileCalculator';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price?: number | null;
  unit?: string;
  isPerSquareMeter?: boolean;
  dimensions?: string | null;
  isAvailable?: boolean;
  isFeatured?: boolean;
  category?: {
    name: string;
    slug: string;
  } | null;
  brand?: {
    name: string;
  } | null;
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
    altText?: string | null;
  }>;
}

export function ProductCard({
  id,
  name,
  slug,
  sku,
  price,
  unit = 'un',
  isPerSquareMeter = false,
  dimensions,
  isAvailable = true,
  isFeatured = false,
  category,
  brand,
  images = [],
}: ProductCardProps) {
  const { addItem } = useQuote();
  const [isAdded, setIsAdded] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const primaryImage = images.find((img) => img.isPrimary)?.imageUrl || images[0]?.imageUrl || '/logo.png';
  const secondaryImage = images[1]?.imageUrl || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPerSquareMeter) {
      setShowCalculator(true);
      return;
    }

    addItem({
      productId: id,
      productName: name,
      sku,
      imageUrl: primaryImage,
      price,
      unit,
      quantity: 1,
      isPerSquareMeter: false,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {isFeatured && (
          <span className="bg-gold-500 text-brand-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Destaque</span>
          </span>
        )}
        {category && (
          <span className="bg-brand-900/90 backdrop-blur-md text-white font-medium text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
            {category.name}
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/produtos/${slug}`} className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        <Image
          src={primaryImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Availability Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full">
              Sob Encomenda
            </span>
          </div>
        )}

        {/* Quick View Floating Action */}
        <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-4">
          <span className="bg-white text-brand-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {brand && (
            <div className="text-[11px] font-bold text-gold-600 uppercase tracking-wider">
              {brand.name}
            </div>
          )}

          <Link href={`/produtos/${slug}`}>
            <h4 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
              {name}
            </h4>
          </Link>

          {dimensions && (
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <span>Dimensões:</span>
              <span className="font-medium text-slate-700">{dimensions}</span>
            </p>
          )}

          {sku && (
            <div className="text-[11px] font-mono text-slate-400">
              Ref: {sku}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              {isPerSquareMeter ? 'Preço por m²' : 'Preço Estimado'}
            </div>
            <div className="text-base font-extrabold text-brand-900 font-display">
              {formatCurrency(price)}
              {isPerSquareMeter && <span className="text-xs font-medium text-slate-500"> /m²</span>}
            </div>
          </div>

          {/* Action Button */}
          {isPerSquareMeter ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowCalculator(true);
              }}
              className="px-3 py-2 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-300/80 font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
              title="Calcular metragem e desperdício"
            >
              <Calculator className="w-3.5 h-3.5 text-gold-600" />
              <span>Calcular m²</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`p-2.5 rounded-xl font-semibold text-xs flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-900 hover:bg-brand-800 text-white'
              }`}
              title="Adicionar à cotação"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-xs">Adicionado</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs">+ Cotação</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Calculator Modal Popover for m² Products */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full animate-in zoom-in-95 duration-150">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCalculator(false)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              >
                ✕
              </button>
              <TileCalculator
                productId={id}
                productName={name}
                sku={sku}
                imageUrl={primaryImage}
                pricePerSquareMeter={price}
                onAdded={() => setShowCalculator(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
