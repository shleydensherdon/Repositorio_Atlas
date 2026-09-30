'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { PackageOpen, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price?: number | null;
  unit: string;
  isPerSquareMeter: boolean;
  dimensions?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string } | null;
  images: Array<{ id: string; imageUrl: string; isPrimary: boolean; altText?: string | null }>;
}

interface CatalogClientProps {
  initialProducts: ProductItem[];
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string }>;
  initialCategorySlug?: string;
}

export function CatalogClient({
  initialProducts,
  categories,
  brands,
  initialCategorySlug = '',
}: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unitFilter, setUnitFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtragem e ordenação reativa
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Categoria
        if (selectedCategory && p.category?.slug !== selectedCategory) {
          return false;
        }
        // Marca
        if (selectedBrand && p.brand?.name !== selectedBrand) {
          return false;
        }
        // Tipo de unidade / m²
        if (unitFilter === 'm2' && !p.isPerSquareMeter) {
          return false;
        }
        if (unitFilter === 'un' && p.isPerSquareMeter) {
          return false;
        }
        // Pesquisa
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
          const matchCat = p.category ? p.category.name.toLowerCase().includes(q) : false;
          if (!matchName && !matchSku && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'price-asc') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [initialProducts, selectedCategory, selectedBrand, searchQuery, unitFilter, sortBy]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setUnitFilter('');
    setSortBy('featured');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden col-span-1 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center space-x-2 text-brand-900 font-bold text-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold-600" />
          <span>Filtros do Catálogo</span>
        </button>
        <span className="text-xs text-slate-500">
          {filteredProducts.length} produtos
        </span>
      </div>

      {/* Desktop Filters Sidebar */}
      <aside className={`lg:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="sticky top-28">
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            searchQuery={searchQuery}
            unitFilter={unitFilter}
            onCategoryChange={setSelectedCategory}
            onBrandChange={setSelectedBrand}
            onSearchChange={setSearchQuery}
            onUnitChange={setUnitFilter}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* Products Grid Section */}
      <main className="lg:col-span-9 space-y-6">
        {/* Top Control Bar: Total count and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-600">
            A mostrar <span className="text-brand-900 font-bold">{filteredProducts.length}</span> produtos disponíveis
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-brand-500"
            >
              <option value="featured">Em Destaque</option>
              <option value="name-asc">Nome (A - Z)</option>
              <option value="name-desc">Nome (Z - A)</option>
              <option value="price-asc">Preço: Mais Baixo</option>
              <option value="price-desc">Preço: Mais Alto</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não foram encontrados produtos com os filtros selecionados. Tente ajustar a pesquisa ou limpar os filtros.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex items-center space-x-2 bg-brand-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
            >
              <span>Limpar Todos os Filtros</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
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
      </main>
    </div>
  );
}
