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
  Building2,
  Calendar,
  MapPin,
  Package
} from 'lucide-react';
import { AdminImageUploader, AdminImageItem } from './AdminImageUploader';

interface ProductOption {
  id: string;
  name: string;
  category?: { name: string } | null;
}

interface ProjectFormData {
  id?: string;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  images: AdminImageItem[];
  productIds: string[];
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  availableProducts: ProductOption[];
  isEditing?: boolean;
}

export function ProjectForm({
  initialData,
  availableProducts,
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    id: initialData?.id || undefined,
    title: initialData?.title || '',
    date: initialData?.date || new Date().getFullYear().toString(),
    location: initialData?.location || 'Maputo, Moçambique',
    category: initialData?.category || 'Residencial',
    description: initialData?.description || '',
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
    images: initialData?.images || [],
    productIds: initialData?.productIds || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.title.trim()) {
      setError('O nome do projeto é obrigatório.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEditing && initialData?.id
        ? `/api/admin/projects/${initialData.id}`
        : '/api/admin/projects';

      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar projeto.');
      }

      setSuccessMsg(isEditing ? 'Projeto atualizado com sucesso!' : 'Projeto publicado com sucesso!');

      setTimeout(() => {
        router.push('/admin/projetos');
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
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/projetos"
            className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Voltar à lista de projetos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {isEditing ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEditing
                ? 'Atualize os dados, galeria de fotos e materiais utilizados na obra'
                : 'Cadastre um projeto ou obra de referência realizada com materiais Atlas'}
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
            <Building2 className="w-4 h-4 text-[#E8611C]" />
            <span>Dados da Obra & Empreendimento</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-300 mb-1">
                Nome do Projeto <span className="text-[#E8611C]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Residência Modern Living Maputo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[#E8611C]" />
                <span>Ano de Conclusão</span>
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Ex: 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs font-mono"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#E8611C]" />
                <span>Localização</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Maputo, Moçambique"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">
                Tipo de Empreendimento
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
              >
                <option value="Residencial">Residencial (Moradias e Condomínios)</option>
                <option value="Comercial">Comercial (Edifícios e Lojas)</option>
                <option value="Hotelaria">Hotelaria & Resorts</option>
                <option value="Industrial">Industrial & Logística</option>
                <option value="Público">Edifícios Públicos & Institucionais</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3">
            Descrição do Projeto e Fornecimento
          </h2>

          <div className="text-xs">
            <label className="block font-bold text-zinc-300 mb-1">
              Descrição Completa
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o escopo da obra, desafios superados, soluções técnicas fornecidas pela Atlas Materials e acabamentos utilizados..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Multi-Photo Gallery Uploader */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <AdminImageUploader
            images={formData.images}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            label="Galeria de Fotografias da Obra"
            helperText="Adicione fotografias reais da obra e acabamentos. A imagem com estrela é a capa do projeto."
          />
        </div>

        {/* Linked Products */}
        {availableProducts.length > 0 && (
          <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3 flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#E8611C]" />
              <span>Produtos Utilizados neste Projeto (Opcional)</span>
            </h2>

            <p className="text-[11px] text-zinc-400">
              Associe produtos do catálogo que foram fornecidos para esta obra. Eles serão apresentados na página de detalhes do projeto.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {availableProducts.map((product) => {
                const isSelected = formData.productIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductToggle(product.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-[#E8611C]/15 border-[#E8611C]/50 text-white font-bold'
                        : 'bg-[#1A1A1A] border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#E8611C] focus:ring-[#E8611C] bg-zinc-900 border-zinc-700 pointer-events-none shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="truncate">{product.name}</div>
                      {product.category && (
                        <div className="text-[10px] text-zinc-500 font-normal">{product.category.name}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visibility & Highlight Toggles */}
        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-3">
            Destaques e Visibilidade
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Featured on Homepage */}
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                formData.isFeatured
                  ? 'bg-[#E8611C]/10 border-[#E8611C]/40 text-white'
                  : 'bg-[#1D1D1D] border-zinc-700/60 text-zinc-300'
              }`}
              onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
            >
              <input
                type="checkbox"
                id="isProjectFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-[#E8611C] focus:ring-[#E8611C] bg-zinc-900 border-zinc-700"
              />
              <div>
                <label htmlFor="isProjectFeatured" className="font-bold cursor-pointer block text-white flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8611C]" />
                  <span>Mostrar na Página Inicial (Destaque)</span>
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Apresenta esta obra na seção de projetos de referência na Homepage.
                </p>
              </div>
            </div>

            {/* Active Status */}
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                formData.isActive
                  ? 'bg-emerald-950/30 border-emerald-800 text-white'
                  : 'bg-[#1D1D1D] border-zinc-700/60 text-zinc-300'
              }`}
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            >
              <input
                type="checkbox"
                id="isProjectActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700"
              />
              <div>
                <label htmlFor="isProjectActive" className="font-bold cursor-pointer block text-white">
                  Projeto Publicado no Website
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Se desmarcado, a página do projeto ficará inacessível publicamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href="/admin/projetos"
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
                <span>{isEditing ? 'Atualizar Projeto' : 'Guardar e Publicar'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
