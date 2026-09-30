'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Layers, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';
import { AdminImageUploader, AdminImageItem } from '@/components/admin/AdminImageUploader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  _count: {
    products: number;
  };
}

interface AdminCategoriesClientProps {
  initialCategories: CategoryWithCount[];
}

export function AdminCategoriesClient({
  initialCategories,
}: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);

  // Modal states for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<AdminImageItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Deletion and reassignment states
  const [deleteCategory, setDeleteCategory] = useState<CategoryWithCount | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setOrderIndex(categories.length);
    setIsActive(true);
    setUploadedImages([]);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setOrderIndex(cat.orderIndex);
    setIsActive(cat.isActive);
    setUploadedImages(cat.imageUrl ? [{ imageUrl: cat.imageUrl, isPrimary: true }] : []);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError('O nome da categoria é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    const primaryImg = uploadedImages.find((i) => i.isPrimary)?.imageUrl || uploadedImages[0]?.imageUrl || imageUrl || null;

    try {
      const isEdit = Boolean(editingCategory);
      const url = isEdit ? `/api/admin/categories/${editingCategory!.id}` : '/api/admin/categories';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          imageUrl: primaryImg,
          orderIndex: Number(orderIndex),
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar categoria.');
      }

      if (isEdit) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory!.id
              ? { ...c, ...data.category, _count: c._count }
              : c
          )
        );
        showToast(`Categoria "${name}" atualizada com sucesso!`);
      } else {
        const newCatWithCount = {
          ...data.category,
          _count: { products: 0 },
        };
        setCategories((prev) => [...prev, newCatWithCount]);
        showToast(`Categoria "${name}" criada com sucesso!`);
      }

      window.dispatchEvent(new Event('atlas-navigation-changed'));
      window.localStorage.setItem('atlas-navigation-version', String(Date.now()));

      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || 'Falha ao guardar categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (cat: CategoryWithCount) => {
    const nextState = !cat.isActive;
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar estado.');

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: nextState } : c))
      );
      showToast(nextState ? `Categoria "${cat.name}" ativada.` : `Categoria "${cat.name}" desativada.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar estado.', 'error');
    }
  };

  const handleDeleteClick = (cat: CategoryWithCount) => {
    setDeleteCategory(cat);
    // Find default other category for reassign if has products
    const other = categories.find((c) => c.id !== cat.id);
    setReassignTargetId(other?.id || '');
  };

  const executeDelete = async () => {
    if (!deleteCategory) return;
    setIsDeleting(true);

    try {
      const queryParams = deleteCategory._count.products > 0 && reassignTargetId
        ? `?reassignTo=${encodeURIComponent(reassignTargetId)}`
        : '';

      const res = await fetch(`/api/admin/categories/${deleteCategory.id}${queryParams}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao remover categoria.');
      }

      // Update state
      if (deleteCategory._count.products > 0 && reassignTargetId) {
        setCategories((prev) =>
          prev
            .filter((c) => c.id !== deleteCategory.id)
            .map((c) =>
              c.id === reassignTargetId
                ? { ...c, _count: { products: c._count.products + deleteCategory._count.products } }
                : c
            )
        );
        showToast(`Categoria removida e ${deleteCategory._count.products} produtos transferidos com sucesso!`);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
        showToast(`Categoria "${deleteCategory.name}" removida com sucesso.`);
      }

      window.dispatchEvent(new Event('atlas-navigation-changed'));
      window.localStorage.setItem('atlas-navigation-version', String(Date.now()));

      setDeleteCategory(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao remover categoria.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gestão de Categorias
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organize os materiais em linhas temáticas (Portas, Casas de Banho, Impermeabilização, etc.).
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Categoria</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category Cover Image */}
              <div className="relative aspect-video w-full bg-[#1A1A1A] overflow-hidden">
                <Image
                  src={cat.imageUrl || '/logo.png'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white border border-zinc-700">
                    {cat._count.products} {cat._count.products === 1 ? 'produto' : 'produtos'}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    #{cat.orderIndex}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {cat.description || 'Sem descrição cadastrada.'}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#111111] border-t border-zinc-800/80 flex items-center justify-between">
              {/* Active status button */}
              <button
                type="button"
                onClick={() => handleToggleActive(cat)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  cat.isActive
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'
                    : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                <span>{cat.isActive ? 'Ativa no Site' : 'Inativa'}</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 transition-colors"
                  title="Editar Categoria"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(cat)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Remover Categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#E8611C]" />
                <span>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Nome da Categoria <span className="text-[#E8611C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Portas e Caixilharia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição da linha de produtos..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-zinc-200">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#E8611C] focus:ring-[#E8611C] bg-zinc-900 border-zinc-700"
                    />
                    <span>Categoria Ativa</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="pt-2">
                <AdminImageUploader
                  images={uploadedImages}
                  onChange={setUploadedImages}
                  maxFiles={1}
                  label="Imagem de Capa da Categoria"
                  helperText="Carregue uma imagem representativa para os cards do catálogo."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? 'Atualizar' : 'Guardar Categoria'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category with Safety Reassignment Modal */}
      {deleteCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Remover Categoria
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deleteCategory._count.products > 0 ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-700/60 text-amber-200">
                  <p className="font-bold mb-1">
                    ⚠️ Esta categoria possui {deleteCategory._count.products} produto(s) vinculado(s)!
                  </p>
                  <p className="text-[11px] text-amber-300/90 leading-relaxed">
                    Para não perder estes produtos, selecione uma nova categoria para transferi-los antes de remover.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">
                    Transferir produtos para:
                  </label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700 text-white text-xs focus:border-[#E8611C] outline-none"
                  >
                    {categories
                      .filter((c) => c.id !== deleteCategory.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tem certeza que deseja remover a categoria <strong className="text-white">&quot;{deleteCategory.name}&quot;</strong>?
              </p>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting || (deleteCategory._count.products > 0 && !reassignTargetId)}
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow active:scale-95 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleteCategory._count.products > 0 ? 'Transferir e Remover' : 'Sim, Remover'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
