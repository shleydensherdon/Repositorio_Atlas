'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Package,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number | null;
  unit: string;
  dimensions: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isPerSquareMeter: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string } | null;
  images: { imageUrl: string; isPrimary: boolean }[];
}

interface CategoryItem {
  id: string;
  name: string;
}

interface AdminProductsClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

export function AdminProductsClient({
  initialProducts,
  categories,
}: AdminProductsClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterFeatured, setFilterFeatured] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Loading states for toggles
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Deletion modal state
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleToggleActive = async (product: ProductItem) => {
    const nextState = !product.isActive;
    setUpdatingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar estado.');
      
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: nextState } : p))
      );
      showToast(nextState ? `"${product.name}" foi ativado no website.` : `"${product.name}" foi desativado.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar estado do produto.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (product: ProductItem) => {
    const nextState = !product.isFeatured;
    setUpdatingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextState }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar destaque.');
      
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: nextState } : p))
      );
      showToast(nextState ? `"${product.name}" adicionado aos destaques da homepage.` : `"${product.name}" removido dos destaques.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar destaque.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao remover produto.');
      }
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      showToast(`Produto "${deleteProduct.name}" removido com sucesso.`);
      window.dispatchEvent(new Event('atlas-navigation-changed'));
      window.localStorage.setItem('atlas-navigation-version', String(Date.now()));
      setDeleteProduct(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao remover produto.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory =
      selectedCategory === 'ALL' || p.categoryId === selectedCategory;

    const matchFeatured =
      filterFeatured === 'ALL'
        ? true
        : filterFeatured === 'FEATURED'
        ? p.isFeatured
        : !p.isFeatured;

    const matchStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'ACTIVE'
        ? p.isActive
        : !p.isActive;

    return matchSearch && matchCategory && matchFeatured && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
            : 'bg-red-950/80 border-red-600 text-red-300'
        }`}>
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gestão de Produtos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Administre todos os materiais, preços em MT, dimensões, destaques e fotos do catálogo.
          </p>
        </div>

        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Produto</span>
        </Link>
      </div>

      {/* Search & Filters Card */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Pesquisar por nome, SKU ou referência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
            >
              <option value="ALL">Todas as Categorias ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured / Status Filter */}
          <div>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
            >
              <option value="ALL">Todos os Produtos</option>
              <option value="FEATURED">Apenas em Destaque</option>
              <option value="NORMAL">Sem Destaque</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
          <span>A mostrar {filteredProducts.length} de {products.length} produtos</span>
          {(searchTerm || selectedCategory !== 'ALL' || filterFeatured !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setFilterFeatured('ALL');
                setFilterStatus('ALL');
              }}
              className="text-[#E8611C] hover:underline font-semibold"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Foto</th>
                <th className="px-5 py-3.5">Nome / SKU</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5">Preço</th>
                <th className="px-5 py-3.5">Dimensões</th>
                <th className="px-5 py-3.5 text-center">Destaque</th>
                <th className="px-5 py-3.5 text-center">Estado</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                    <span className="block font-semibold">Nenhum produto encontrado</span>
                    <span className="text-[11px]">Tente alterar os termos de pesquisa ou filtros.</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImg = p.images.find((i) => i.isPrimary)?.imageUrl || p.images[0]?.imageUrl || '/logo.png';
                  const isUpdating = updatingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="px-5 py-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] border border-zinc-700/80 overflow-hidden relative shadow-inner">
                          <Image
                            src={primaryImg}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                        <div className="flex items-center space-x-2 text-[11px] mt-0.5">
                          <span className="font-mono text-[#E8611C] bg-[#E8611C]/10 px-1.5 py-0.5 rounded border border-[#E8611C]/30">
                            {p.sku || 'Sem SKU'}
                          </span>
                          {p.brand && (
                            <span className="text-zinc-400">· {p.brand.name}</span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                          {p.category?.name || 'Sem Categoria'}
                        </span>
                      </td>

                      {/* Price in MT */}
                      <td className="px-5 py-3.5">
                        <div className="font-extrabold text-white text-xs">
                          {formatCurrency(p.price)}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          por {p.unit} {p.isPerSquareMeter && '(c/ m²)'}
                        </div>
                      </td>

                      {/* Dimensions */}
                      <td className="px-5 py-3.5 text-zinc-300">
                        {p.dimensions || <span className="text-zinc-600">—</span>}
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          disabled={isUpdating}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.isFeatured
                              ? 'bg-[#E8611C]/20 text-[#E8611C] border border-[#E8611C]/40 hover:bg-[#E8611C]/30'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                          }`}
                          title={p.isFeatured ? "Remover dos destaques da Home" : "Destacar na Home"}
                        >
                          <Sparkles className={`w-3 h-3 ${p.isFeatured ? 'fill-[#E8611C]' : ''}`} />
                          <span>{p.isFeatured ? 'Destaque' : 'Normal'}</span>
                        </button>
                      </td>

                      {/* Active Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          disabled={isUpdating}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'
                              : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                          }`}
                          title={p.isActive ? "Desativar produto" : "Ativar produto no catálogo"}
                        >
                          {p.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Ativo</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                              <span>Inativo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                        {/* View on Public Website */}
                        <Link
                          href={`/produtos/${p.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 inline-block transition-colors"
                          title="Visualizar no website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit Product */}
                        <Link
                          href={`/admin/produtos/${p.id}`}
                          className="p-2 rounded-xl text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 inline-block transition-colors"
                          title="Editar produto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Product */}
                        <button
                          type="button"
                          onClick={() => setDeleteProduct(p)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 inline-block transition-colors"
                          title="Remover produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteProduct)}
        title="Remover Produto do Catálogo"
        description={`Tem certeza que deseja remover o produto "${deleteProduct?.name}"?\nEsta ação apagará permanentemente o produto e as fotos associadas do sistema.`}
        confirmLabel="Sim, Remover"
        cancelLabel="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </div>
  );
}
