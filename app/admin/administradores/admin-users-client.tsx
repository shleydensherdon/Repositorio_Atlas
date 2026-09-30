'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Shield, 
  Trash2, 
  Edit, 
  KeyRound, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  X,
  Lock
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}

interface AdminUsersClientProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

export function AdminUsersClient({
  initialUsers,
  currentUserId,
}: AdminUsersClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Deletion State
  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('ADMIN');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // leave empty to not change
    setRole(user.role);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError('Nome e e-mail são obrigatórios.');
      return;
    }

    if (!editingUser && (!password || password.length < 6)) {
      setFormError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    if (editingUser && password && password.length < 6) {
      setFormError('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = Boolean(editingUser);
      const url = isEdit ? `/api/admin/users/${editingUser!.id}` : '/api/admin/users';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      };

      if (password) {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar utilizador.');
      }

      if (isEdit) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser!.id ? { ...u, ...data.user } : u))
        );
        showToast(`Administrador "${name}" atualizado com sucesso!`);
      } else {
        setUsers((prev) => [data.user, ...prev]);
        showToast(`Novo administrador "${name}" registado com sucesso!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Falha ao processar pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao remover administrador.');
      }

      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      showToast(`Administrador "${deleteUser.name}" removido com sucesso.`);
      setDeleteUser(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao remover.', 'error');
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gestão de Administradores
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Crie novas contas para a sua equipa, redefina palavras-passe ou remova acessos ao painel.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Adicionar Administrador</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Administrador</th>
                <th className="px-5 py-3.5">E-mail de Acesso</th>
                <th className="px-5 py-3.5">Nível / Cargo</th>
                <th className="px-5 py-3.5">Data de Registo</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map((u) => {
                const isCurrent = u.id === currentUserId;

                return (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* User name & avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E8611C]/15 border border-[#E8611C]/30 text-[#E8611C] flex items-center justify-center font-bold text-xs">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            ID: {u.id.slice(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 font-mono text-zinc-300">
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-[#E8611C]/20 text-[#E8611C] border border-[#E8611C]/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{u.role}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-zinc-400">
                      {new Date(u.createdAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 transition-colors inline-block"
                        title="Editar Administrador / Alterar Palavra-passe"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteUser(u)}
                        disabled={isCurrent}
                        className={`p-2 rounded-xl transition-colors inline-block ${
                          isCurrent
                            ? 'text-zinc-600 cursor-not-allowed'
                            : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
                        }`}
                        title={isCurrent ? "Não é possível remover a sua própria conta" : "Remover Administrador"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#181818] border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#E8611C]" />
                <span>{editingUser ? 'Editar Administrador' : 'Criar Novo Administrador'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Nome Completo <span className="text-[#E8611C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  E-mail de Login <span className="text-[#E8611C]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: carlos@atlasmaterials.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  {editingUser ? 'Nova Palavra-passe (deixe em branco para não alterar)' : 'Palavra-passe *'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required={!editingUser}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#E8611C] outline-none text-xs"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Cargo / Permissão
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D1D] border border-zinc-700/80 text-white focus:border-[#E8611C] outline-none text-xs"
                >
                  <option value="ADMIN">ADMIN (Acesso Total ao Catálogo e Sistema)</option>
                  <option value="GESTOR">GESTOR (Edição de Produtos e Projetos)</option>
                </select>
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
                  <span>{editingUser ? 'Atualizar Conta' : 'Criar Administrador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteUser)}
        title="Remover Administrador"
        description={`Tem a certeza que deseja remover o acesso do administrador "${deleteUser?.name}" (${deleteUser?.email})?\nEle perderá imediatamente o acesso ao painel de gestão.`}
        confirmLabel="Sim, Remover Acesso"
        cancelLabel="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteUser(null)}
      />
    </div>
  );
}
