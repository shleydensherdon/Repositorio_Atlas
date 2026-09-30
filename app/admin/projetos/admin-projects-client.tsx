'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  category: string | null;
  date: string | null;
  description: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  isActive: boolean;
  images: { imageUrl: string; isPrimary: boolean }[];
  products: { product: { name: string } }[];
}

interface AdminProjectsClientProps {
  initialProjects: ProjectItem[];
}

export function AdminProjectsClient({
  initialProjects,
}: AdminProjectsClientProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [deleteProject, setDeleteProject] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleActive = async (proj: ProjectItem) => {
    const nextState = !proj.isActive;
    setUpdatingId(proj.id);
    try {
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar estado.');

      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, isActive: nextState } : p))
      );
      showToast(nextState ? `Projeto "${proj.title}" ativado no site.` : `Projeto "${proj.title}" desativado.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar estado do projeto.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (proj: ProjectItem) => {
    const nextState = !proj.isFeatured;
    setUpdatingId(proj.id);
    try {
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextState }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar destaque.');

      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, isFeatured: nextState } : p))
      );
      showToast(nextState ? `Projeto "${proj.title}" destacado na Homepage.` : `Projeto "${proj.title}" removido do destaque.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar destaque.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteProject) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteProject.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao remover projeto.');
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
      showToast(`Projeto "${deleteProject.title}" removido com sucesso.`);
      setDeleteProject(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao remover projeto.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      (p.location && p.location.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.date && p.date.includes(term))
    );
  });

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
            Gestão de Projetos & Obras
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Administre os empreendimentos e obras de referência executados com materiais Atlas Materials.
          </p>
        </div>

        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Projeto</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar por nome, localização ou ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
          />
        </div>

        <div className="text-xs text-zinc-400">
          Total de {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'} cadastrados
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 bg-[#141414] border border-zinc-800 rounded-2xl">
            <Building2 className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-xs font-semibold">Nenhum projeto encontrado</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Clique no botão acima para adicionar o primeiro projeto.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const cover = proj.coverImage || proj.images[0]?.imageUrl || '/logo.png';
            const isUpdating = updatingId === proj.id;

            return (
              <div
                key={proj.id}
                className="bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative aspect-video w-full bg-[#1A1A1A] overflow-hidden">
                    <Image
                      src={cover}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {proj.category && (
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-zinc-700">
                        {proj.category}
                      </div>
                    )}
                    {proj.images.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-zinc-300 text-[10px] px-2 py-0.5 rounded font-mono">
                        {proj.images.length} fotos
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                      {proj.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#E8611C]" />
                          <span>{proj.location}</span>
                        </span>
                      )}
                      {proj.date && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-[#E8611C]" />
                          <span>{proj.date}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#E8611C] transition-colors line-clamp-1">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {proj.description || 'Sem descrição detalhada.'}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#111111] border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    {/* Featured Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(proj)}
                      disabled={isUpdating}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        proj.isFeatured
                          ? 'bg-[#E8611C]/20 text-[#E8611C] border border-[#E8611C]/40 hover:bg-[#E8611C]/30'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                      title={proj.isFeatured ? "Remover dos destaques da Home" : "Destacar na Homepage"}
                    >
                      <Sparkles className={`w-3 h-3 ${proj.isFeatured ? 'fill-[#E8611C]' : ''}`} />
                      <span>{proj.isFeatured ? 'Destaque na Home' : 'Normal'}</span>
                    </button>

                    {/* Active Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(proj)}
                      disabled={isUpdating}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        proj.isActive
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${proj.isActive ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
                      <span>{proj.isActive ? 'Publicado' : 'Oculto'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <Link
                      href={`/projetos/${proj.slug}`}
                      target="_blank"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      <span>Ver no Site</span>
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center space-x-1">
                      <Link
                        href={`/admin/projetos/${proj.id}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 transition-colors"
                        title="Editar Projeto"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteProject(proj)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Remover Projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteProject)}
        title="Remover Projeto"
        description={`Tem certeza que deseja remover o projeto "${deleteProject?.title}"?\nTodas as fotografias e associações a produtos serão excluídas.`}
        confirmLabel="Sim, Remover"
        cancelLabel="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProject(null)}
      />
    </div>
  );
}
