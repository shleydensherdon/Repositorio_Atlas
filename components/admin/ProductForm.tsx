'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Package
} from 'lucide-react';
import { AdminImageUploader, AdminImageItem } from './AdminImageUploader';

interface CategoryOption {
  id: string;
  name: string;
}

interface BrandOption {
  id: string;
  name: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  categoryId: string;
  brandId: string;
  price: string | number;
  unit: string;
  dimensions: string;
  tileLengthMeters: string | number;
  tileWidthMeters: string | number;
  tileAreaSquareMeters?: number | null;
  shortDescription: string;
  description: string;
  isPerSquareMeter: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isAvailable: boolean;
  images: AdminImageItem[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  brands: BrandOption[];
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  brands,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    id: initialData?.id || undefined,
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    brandId: initialData?.brandId || '',
    price: initialData?.price !== undefined && initialData?.price !== null ? initialData.price : '',
    unit: initialData?.unit || 'un',
    dimensions: initialData?.dimensions || '',
    tileLengthMeters: initialData?.tileLengthMeters ?? '',
    tileWidthMeters: initialData?.tileWidthMeters ?? '',
    tileAreaSquareMeters: initialData?.tileAreaSquareMeters ?? null,
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    isPerSquareMeter: initialData?.isPerSquareMeter ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
    isAvailable: initialData?.isAvailable ?? true,
    images: initialData?.images || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    if (!formData.categoryId) {
      setError('Selecione uma categoria.');
      return;
    }

    if (formData.isPerSquareMeter && (!Number(formData.tileLengthMeters) || !Number(formData.tileWidthMeters))) {
      setError('Para tijoleiras, indique o comprimento e a largura em metros.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEditing && initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';

      const method = isEditing ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        price: formData.price === '' ? null : Number(formData.price),
        tileLengthMeters: formData.isPerSquareMeter ? Number(formData.tileLengthMeters) : null,
        tileWidthMeters: formData.isPerSquareMeter ? Number(formData.tileWidthMeters) : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar produto.');
      }

      setSuccessMsg(isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado e publicado com sucesso!');
      window.dispatchEvent(new Event('atlas-navigation-changed'));
      window.localStorage.setItem('atlas-navigation-version', String(Date.now()));
      
      setTimeout(() => {
        router.push('/admin/produtos');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Falha na comunicação com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/produtos"
            className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Voltar à lista de produtos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEditing
                ? 'Atualize as especificações, fotos e disponibilidade do material'
                : 'Preencha os campos para cadastrar o produto no website Atlas Materials'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3 flex items-center space-x-2">
            <Package className="w-4 h-4 text-[#E8611C]" />
            <span>Identificação e Classificação</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-300 mb-1">
                Nome do Produto <span className="text-[#E8611C]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Porta de Madeira Maciça Pivotante 210x90cm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Referência / SKU Comercial
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: ATL-POR-001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none font-mono text-xs"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Categoria <span className="text-[#E8611C]">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
              >
                <option value="" disabled>Selecione uma categoria...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Marca / Fabricante
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
              >
                <option value="">Atlas Prime / Própria</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Dimensões / Medidas
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Ex: 210 × 90 cm (Espessura 40 mm)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
              />
            </div>

            {formData.isPerSquareMeter && (
              <div className="sm:col-span-2 rounded-xl border border-[#E8611C]/30 bg-[#E8611C]/5 p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-[#FFB38A]">Dados da Tijoleira</h3>
                  <p className="mt-1 text-[10px] text-zinc-400">O código fica no campo SKU. Use metros, por exemplo 0,60 x 1,20.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Comprimento (m)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={formData.tileLengthMeters}
                      onChange={(e) => setFormData({ ...formData, tileLengthMeters: e.target.value })}
                      placeholder="Ex: 0.60"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Largura (m)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={formData.tileWidthMeters}
                      onChange={(e) => setFormData({ ...formData, tileWidthMeters: e.target.value })}
                      placeholder="Ex: 1.20"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                    />
                  </div>
                </div>
                <div className="text-xs text-zinc-300">
                  Área de cada peça: <strong className="text-[#FFB38A]">{(Number(formData.tileLengthMeters || 0) * Number(formData.tileWidthMeters || 0)).toFixed(4)} m²</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Units Card */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3 flex items-center space-x-2">
            <span className="text-[#E8611C] font-extrabold text-sm">MT</span>
            <span>Preço e Unidade Comercial (Meticais Moçambique)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Preço Unitário (MT)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 25000"
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs font-mono font-bold"
                />
                <span className="absolute right-3.5 top-2.5 font-bold text-xs text-[#E8611C]">
                  MT
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Deixe em branco para exibir &quot;Sob Consulta&quot;.
              </span>
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Unidade de Venda
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
              >
                <option value="un">un (Unidade / Peça)</option>
                <option value="m²">m² (Metro Quadrado)</option>
                <option value="caixa">caixa</option>
                <option value="conjunto">conjunto (Kit Completo)</option>
                <option value="saco">saco / embalagem</option>
                <option value="metro">metro linear</option>
              </select>
            </div>
          </div>

          {/* Calculator toggle */}
          <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-zinc-700/60 flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPerSqM"
              checked={formData.isPerSquareMeter}
              onChange={(e) => setFormData({ ...formData, isPerSquareMeter: e.target.checked })}
              className="w-4 h-4 rounded text-[#E8611C] focus:ring-[#E8611C] bg-zinc-900 border-zinc-700"
            />
            <label htmlFor="isPerSqM" className="text-xs font-semibold text-zinc-200 cursor-pointer">
              Ativar Calculadora de Área & Desperdício (+10% margem técnica) para este produto
            </label>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3">
            Descrições do Produto
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Descrição Curta (1-2 frases para cards e catálogo)
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Ex: Porta maciça com acabamento envernizado de alta resistência para interiores e entradas."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Descrição Completa e Especificações Técnicas
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva as propriedades técnicas, certificações, aplicações recomendadas, cuidados e modo de instalação..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Image Gallery Uploader */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <AdminImageUploader
            images={formData.images}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            label="Fotografias do Produto"
            helperText="Adicione a fotografia principal e fotos adicionais em detalhe. A imagem com estrela é a capa principal."
          />
        </div>

        {/* Visibility & Highlight Toggles */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3">
            Visibilidade e Destaques
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Featured on Homepage */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              formData.isFeatured
                ? 'bg-[#E8611C]/10 border-[#E8611C]/40 text-white'
                : 'bg-[#1D1D1D] border-zinc-700/60 text-zinc-300'
            }`}
            onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
            >
              <input
                type="checkbox"
                id="isFeaturedToggle"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-[#E8611C] focus:ring-[#E8611C] bg-zinc-900 border-zinc-700"
              />
              <div>
                <label htmlFor="isFeaturedToggle" className="font-bold cursor-pointer block text-white flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8611C]" />
                  <span>Mostrar na Página Inicial (Destaque)</span>
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Exibe este produto na seção de produtos em destaque na Homepage.
                </p>
              </div>
            </div>

            {/* Active Status */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              formData.isActive
                ? 'bg-emerald-950/30 border-emerald-800 text-white'
                : 'bg-[#1D1D1D] border-zinc-700/60 text-zinc-300'
            }`}
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            >
              <input
                type="checkbox"
                id="isActiveToggle"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700"
              />
              <div>
                <label htmlFor="isActiveToggle" className="font-bold cursor-pointer block text-white">
                  Produto Ativo no Catálogo
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Se desmarcado, o produto fica oculto no website público.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href="/admin/produtos"
            className="px-5 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-7 py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A guardar...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Atualizar Produto' : 'Guardar e Publicar'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
