'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Calculator, 
  Check, 
  Plus, 
  Minus, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { formatCurrency, formatArea } from '@/lib/utils';
import { TileCalculator } from '@/components/calculator/TileCalculator';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    price?: number | null;
    unit: string;
    isPerSquareMeter: boolean;
    dimensions?: string | null;
    isAvailable: boolean;
    imageUrl?: string | null;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addItem, setIsDrawerOpen } = useQuote();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showTileCalculator, setShowTileCalculator] = useState(product.isPerSquareMeter);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      imageUrl: product.imageUrl,
      price: product.price,
      unit: product.unit,
      quantity,
      isPerSquareMeter: product.isPerSquareMeter,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* If product is sold per m², show embedded interactive calculator */}
      {product.isPerSquareMeter ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider flex items-center space-x-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadora de Quantidade e Cortes</span>
            </span>
          </div>
          <TileCalculator
            productId={product.id}
            productName={product.name}
            sku={product.sku}
            imageUrl={product.imageUrl}
            pricePerSquareMeter={product.price}
            compact={false}
          />
        </div>
      ) : (
        /* Regular Product Quantity and Add to Cart */
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Quantidade Desejada</span>
              <div className="text-xs text-slate-400">Unidade: {product.unit}</div>
            </div>

            {/* Counter */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-sm text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtotal preview */}
          {product.price && (
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Subtotal Estimado:</span>
              <span className="font-extrabold text-brand-900 text-sm font-display">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>
          )}

          {/* Add to Quote Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-900 hover:bg-brand-800 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Adicionado à Minha Cotação!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Adicionar à Minha Cotação</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Direct WhatsApp Call */}
      <a
        href={`https://wa.me/258874438819?text=${encodeURIComponent(
          `Olá Atlas Materials! Gostaria de uma cotação para o produto:\n*${product.name}*\nRef: ${product.sku || 'N/A'}\nPreço indicado: ${formatCurrency(product.price)}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-3.5 px-6 rounded-xl font-bold text-sm shadow-sm transition-all"
      >
        <MessageCircle className="w-5 h-5 text-emerald-600" />
        <span>Pedir Cotação Rápida no WhatsApp</span>
      </a>
    </div>
  );
}
