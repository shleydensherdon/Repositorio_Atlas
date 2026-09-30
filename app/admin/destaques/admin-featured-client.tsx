'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Package,
  Layers,
  Eye,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number | null;
  unit: string;
  isFeatured: boolean;
  isActive: boolean;
  category: { id: string; name: string } | null;
  images: { imageUrl: string; isPrimary: boolean }[];
}

interface AdminFeaturedClientProps {
  initialProducts: ProductItem[];
}

export function AdminFeaturedClient({
  initialProducts,
}: AdminFeaturedClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const featuredList = products.filter((p) => p.isFeatured);
  const nonFeaturedList = products
    .filter((p) => !p.isFeatured)
    .filter((p) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.category && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
    );

  const handleToggleFeatured = async (product: ProductItem, makeFeatured: boolean) => {
    setUpdatingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: makeFeatured }),
      });

      if (!res.ok) throw new Error('Erro ao alterar destaque.');

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: makeFeatured } : p))
      );

      showToast(
        makeFeatured
          ? `"${product.name}" adicionado à seção de destaques da Homepage!`
          : `"${product.name}" removido dos destaques.`
      );
    } catch (err: any) {
      showToast(err.message || 'Falha ao atualizar destaque.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
            : 'bg-red-950/80 border-red-600 text-red-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#E8611C] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Página Inicial · Homepage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Produtos em Destaque
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Escolha os produtos que aparecem na vitrine principal da página inicial. As mudanças refletem imediatamente no website.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-700 transition-colors"
        >
          <span>Visualizar na Home</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Current Featured Section */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#E8611C]" />
            <h2 className="text-sm font-bold text-white">
              Produtos Atualmente em Destaque ({featuredList.length})
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400">
            Exibidos na vitrine premium da Homepage
          </span>
        </div>

        {featuredList.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 space-y-2">
            <Package className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-xs font-semibold">Nenhum produto destacado de momento.</p>
            <p className="text-[11px]">Selecione produtos na lista abaixo para exibi-los na página inicial.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredList.map((p, index) => {
              const img = p.images.find((i) => i.isPrimary)?.imageUrl || p.images[0]?.imageUrl || '/logo.png';
              const isUpdating = updatingId === p.id;

              return (
                <div
                  key={p.id}
                  className="bg-[#1C1C1C] border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-[#E8611C]/50 transition-all shadow-md group relative"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-lg bg-[#242424] border border-zinc-700 overflow-hidden relative shrink-0">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#E8611C] uppercase tracking-wider block">
                        {p.category?.name || 'Geral'}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5" title={p.name}>
                        {p.name}
                      </h4>
                      <div className="text-xs font-extrabold text-white mt-1">
                        {formatCurrency(p.price)}
                        <span className="text-[10px] text-zinc-400 font-normal"> /{p.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Posição #{index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p, false)}
                      disabled={isUpdating}
                      className="inline-flex items-center space-x-1 text-red-400 hover:text-red-300 text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-red-950/40 border border-transparent hover:border-red-800 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover dos Destaques</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Products to Add Section */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">
              Adicionar Mais Produtos aos Destaques
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Clique em &quot;+ Adicionar aos Destaques&quot; para promover qualquer produto na página inicial
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
            />
          </div>
        </div>

        {nonFeaturedList.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            {searchTerm ? 'Nenhum produto corresponde à pesquisa.' : 'Todos os produtos já estão em destaque!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nonFeaturedList.map((p) => {
              const img = p.images.find((i) => i.isPrimary)?.imageUrl || p.images[0]?.imageUrl || '/logo.png';
              const isUpdating = updatingId === p.id;

              return (
                <div
                  key={p.id}
                  className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-3 flex items-center justify-between space-x-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#222222] border border-zinc-700 overflow-hidden relative shrink-0">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[170px]" title={p.name}>
                        {p.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-semibold">
                        {formatCurrency(p.price)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p, true)}
                    disabled={isUpdating}
                    className="inline-flex items-center space-x-1 bg-[#E8611C] hover:bg-[#C74E13] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow transition-all active:scale-95 shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Destacar</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
