'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, Plus, Check, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { formatCurrency, formatArea } from '@/lib/utils';

interface TileCalculatorProps {
  productId?: string;
  productName?: string;
  sku?: string | null;
  imageUrl?: string | null;
  pricePerSquareMeter?: number | null;
  onAdded?: () => void;
  compact?: boolean;
}

export function TileCalculator({
  productId = 'calc-item',
  productName = 'Porcelanato / Tijoleira Cerâmica',
  sku = 'CALC-001',
  imageUrl,
  pricePerSquareMeter,
  onAdded,
  compact = false,
}: TileCalculatorProps) {
  const { addItem } = useQuote();
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [isAdded, setIsAdded] = useState(false);

  // Validações
  const safeLength = Math.max(0, isNaN(length) ? 0 : length);
  const safeWidth = Math.max(0, isNaN(width) ? 0 : width);
  const safeWaste = Math.max(0, isNaN(wastePercentage) ? 0 : wastePercentage);

  const rawArea = Number((safeLength * safeWidth).toFixed(2));
  const totalAreaWithWaste = Number((rawArea * (1 + safeWaste / 100)).toFixed(2));
  const estimatedPrice = pricePerSquareMeter ? totalAreaWithWaste * pricePerSquareMeter : null;

  const handleAdd = () => {
    if (totalAreaWithWaste <= 0) return;

    addItem({
      productId,
      productName,
      sku,
      imageUrl,
      price: pricePerSquareMeter,
      unit: 'm²',
      quantity: totalAreaWithWaste,
      isPerSquareMeter: true,
      length: safeLength,
      width: safeWidth,
      wastePercentage: safeWaste,
      calculatedArea: totalAreaWithWaste,
    });

    setIsAdded(true);
    if (onAdded) onAdded();
    setTimeout(() => setIsAdded(false), 2500);
  };

  const wasteOptions = [
    { label: 'Corte Reto (10%)', value: 10, desc: 'Padrão para alinhamentos simples' },
    { label: 'Corte Diagonal (15%)', value: 15, desc: 'Instalação a 45 graus' },
    { label: 'Espinha / Chevron (20%)', value: 20, desc: 'Padrões geométricos complexos' },
  ];

  return (
    <div className={`rounded-2xl border ${compact ? 'p-4 bg-slate-50 border-slate-200' : 'p-6 bg-gradient-to-br from-brand-900 via-brand-900 to-slate-900 text-white shadow-xl border-brand-800'}`}>
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold ${compact ? 'text-brand-900 text-base' : 'text-white text-lg font-display'}`}>
              Calculadora de Tijoleiras & m²
            </h3>
            <p className={`text-xs ${compact ? 'text-slate-500' : 'text-slate-300'}`}>
              Calcule a área do espaço e adicione a percentagem de corte
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Dimensões */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${compact ? 'text-slate-700' : 'text-slate-200'}`}>
              Comprimento (metros)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={length || ''}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all outline-none ${
                compact 
                  ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-500' 
                  : 'bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:border-gold-400'
              }`}
              placeholder="Ex: 5.0"
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${compact ? 'text-slate-700' : 'text-slate-200'}`}>
              Largura (metros)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={width || ''}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all outline-none ${
                compact 
                  ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-500' 
                  : 'bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:border-gold-400'
              }`}
              placeholder="Ex: 4.0"
            />
          </div>
        </div>

        {/* Desperdício */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`text-xs font-semibold ${compact ? 'text-slate-700' : 'text-slate-200'}`}>
              Margem de Desperdício / Cortes
            </label>
            <span className={`text-xs font-bold ${compact ? 'text-brand-900' : 'text-gold-400'}`}>
              +{safeWaste}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {wasteOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setWastePercentage(opt.value)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                  safeWaste === opt.value
                    ? compact 
                      ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                      : 'bg-gold-500 text-brand-950 border-gold-400 font-bold shadow-md'
                    : compact
                      ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {opt.value}%
              </button>
            ))}
          </div>
        </div>

        {/* Painel de Resultados */}
        <div className={`p-4 rounded-xl space-y-2.5 ${compact ? 'bg-white border border-slate-200' : 'bg-white/10 border border-white/10 backdrop-blur-sm'}`}>
          <div className="flex justify-between items-center text-xs">
            <span className={compact ? 'text-slate-500' : 'text-slate-300'}>Área Líquida:</span>
            <span className={`font-semibold ${compact ? 'text-slate-800' : 'text-white'}`}>
              {formatArea(rawArea)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={compact ? 'text-slate-500' : 'text-slate-300'}>Margem de Segurança ({safeWaste}%):</span>
            <span className={`font-semibold ${compact ? 'text-amber-600' : 'text-gold-400'}`}>
              +{((totalAreaWithWaste - rawArea)).toFixed(2).replace('.', ',')} m²
            </span>
          </div>

          <div className="border-t border-dashed border-slate-300/40 my-2"></div>

          <div className="flex justify-between items-center">
            <span className={`text-sm font-bold ${compact ? 'text-brand-900' : 'text-white'}`}>
              Área Total Necessária:
            </span>
            <span className={`text-lg font-extrabold ${compact ? 'text-brand-900' : 'text-gold-400 font-display'}`}>
              {formatArea(totalAreaWithWaste)}
            </span>
          </div>

          {pricePerSquareMeter && (
            <div className="flex justify-between items-center pt-1 text-xs">
              <span className={compact ? 'text-slate-500' : 'text-slate-300'}>
                Preço Estimado ({formatCurrency(pricePerSquareMeter)}/m²):
              </span>
              <span className={`font-bold ${compact ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {formatCurrency(estimatedPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Botão de Adicionar à Cotação */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={totalAreaWithWaste <= 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : compact
                ? 'bg-brand-900 hover:bg-brand-800 text-white'
                : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-brand-950 font-bold'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Adicionado à Cotação!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Adicionar {formatArea(totalAreaWithWaste)} à Minha Cotação</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
