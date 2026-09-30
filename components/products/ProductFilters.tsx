'use client';

import React from 'react';
import { Search, Filter, X, Check } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface BrandOption {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
  brands: BrandOption[];
  selectedCategory: string;
  selectedBrand: string;
  searchQuery: string;
  unitFilter: string;
  onCategoryChange: (slug: string) => void;
  onBrandChange: (id: string) => void;
  onSearchChange: (query: string) => void;
  onUnitChange: (unit: string) => void;
  onReset: () => void;
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  searchQuery,
  unitFilter,
  onCategoryChange,
  onBrandChange,
  onSearchChange,
  onUnitChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters = Boolean(
    selectedCategory || selectedBrand || searchQuery || unitFilter
  );

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-brand-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-gold-600" />
          <span>Filtros do Catálogo</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Pesquisar por Nome ou SKU
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ex: Sanita, Porcelanato, Misturadora..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Linhas / Categorias
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === ''
                ? 'bg-brand-900 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Todas as Categorias</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-brand-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Unidade / Calculadora m² */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Tipo de Produto
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUnitChange(unitFilter === 'm2' ? '' : 'm2')}
            className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
              unitFilter === 'm2'
                ? 'bg-gold-50 border-gold-400 text-gold-900 font-bold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🧱 Vendido a m²
          </button>
          <button
            type="button"
            onClick={() => onUnitChange(unitFilter === 'un' ? '' : 'un')}
            className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
              unitFilter === 'un'
                ? 'bg-brand-50 border-brand-400 text-brand-900 font-bold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            📦 Unidade / Peça
          </button>
        </div>
      </div>
    </div>
  );
}
