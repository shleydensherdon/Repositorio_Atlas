'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  MessageCircle, 
  FileText,
  Calculator
} from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { formatCurrency, formatArea } from '@/lib/utils';

export function QuoteDrawer() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearQuote, 
    totalItemsCount, 
    estimatedTotal, 
    isDrawerOpen, 
    setIsDrawerOpen 
  } = useQuote();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-brand-900 text-white">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="font-bold text-lg font-display">Minha Cotação</h3>
                <p className="text-xs text-slate-300">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-slate-800 text-base">A sua cotação está vazia</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore o catálogo da Atlas Materials e adicione sanitários, porcelanatos, torneiras ou portas para obter uma cotação personalizada.
                </p>
                <Link
                  href="/produtos"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-2 inline-flex items-center space-x-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors relative group"
                >
                  <div className="flex space-x-3">
                    {/* Imagem do Produto */}
                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden relative shrink-0">
                      <Image
                        src={item.imageUrl || '/logo.png'}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Informações do Item */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h5 className="text-sm font-semibold text-slate-900 truncate">
                        {item.productName}
                      </h5>
                      {item.sku && (
                        <span className="text-[11px] font-mono text-slate-400 block">
                          SKU: {item.sku}
                        </span>
                      )}

                      {/* Se for calculado por m² */}
                      {item.isPerSquareMeter && item.calculatedArea && (
                        <div className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded bg-gold-50 border border-gold-200 text-gold-800 text-[11px] font-medium">
                          <Calculator className="w-3 h-3 text-gold-600" />
                          <span>
                            {item.length}m × {item.width}m (+{item.wastePercentage}% corte) = {formatArea(item.calculatedArea)}
                          </span>
                        </div>
                      )}

                      {/* Preço Unitário e Subtotal */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs font-bold text-brand-900">
                          {formatCurrency(item.subtotal)}
                        </div>

                        {/* Controles de Quantidade */}
                        <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - (item.isPerSquareMeter ? 1 : 1)))}
                            className="p-1 text-slate-600 hover:text-brand-900 hover:bg-slate-100 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5 min-w-[2rem] text-center">
                            {item.isPerSquareMeter ? `${item.quantity} ${item.unit}` : item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + (item.isPerSquareMeter ? 1 : 1))}
                            className="p-1 text-slate-600 hover:text-brand-900 hover:bg-slate-100 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Remover */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer: Summary and Proceed */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total de Itens:</span>
                  <span className="font-semibold">{totalItemsCount} produtos</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Estimado:</span>
                  <span className="text-base text-brand-900 font-display font-extrabold">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * Valores sujeitos a confirmação de stock, descontos por quantidade e taxas de transporte.
                </p>
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  href="/cotacao"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-900 hover:bg-brand-800 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Finalizar Pedido de Cotação</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clearQuote}
                    className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Limpar cesto
                  </button>

                  <a
                    href={`https://wa.me/258874438819?text=${encodeURIComponent(
                      `Olá Atlas Materials! Tenho ${items.length} produtos na minha cotação preliminar e gostaria de obter valores e prazos.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Perguntar no WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
