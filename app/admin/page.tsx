import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { 
  Package, 
  Layers, 
  Sparkles, 
  Building2, 
  FileText, 
  Plus, 
  ArrowRight, 
  Eye, 
  Edit,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import VisitorsChart from '@/components/admin/VisitorsChart';

export const revalidate = 0; // Always fresh data in admin

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    featuredProductsCount,
    totalCategories,
    totalProjects,
    featuredProjectsCount,
    totalQuotes,
    newQuotes,
    recentProducts,
    recentProjects,
    recentQuotes,
    visitsData,
  ] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.category.count(),
    prisma.project.count(),
    prisma.project.count({ where: { isFeatured: true } }),
    prisma.quote.count(),
    prisma.quote.count({ where: { status: 'NOVO' } }),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { orderIndex: 'asc' } },
      },
    }),
    prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
      },
    }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.siteVisit.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
        },
      },
      select: { createdAt: true },
    }),
  ]);

  // Process visits data for the chart
  const visitsByDate = visitsData.reduce((acc: any, visit) => {
    const dateStr = visit.createdAt.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
    if (!acc[dateStr]) {
      acc[dateStr] = 0;
    }
    acc[dateStr]++;
    return acc;
  }, {});

  const chartData = Object.keys(visitsByDate).map(date => ({
    date,
    visitas: visitsByDate[date]
  })).slice(-30);

  const stats = [
    {
      title: 'Produtos no Catálogo',
      value: totalProducts,
      sub: `${activeProducts} ativos · ${totalProducts - activeProducts} inativos`,
      icon: Package,
      href: '/admin/produtos',
      color: 'bg-[#E8611C]/15 text-[#E8611C] border border-[#E8611C]/30',
    },
    {
      title: 'Categorias de Materiais',
      value: totalCategories,
      sub: 'Linhas temáticas cadastradas',
      icon: Layers,
      href: '/admin/categorias',
      color: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    },
    {
      title: 'Produtos em Destaque',
      value: featuredProductsCount,
      sub: 'Exibidos na Homepage',
      icon: Sparkles,
      href: '/admin/destaques',
      color: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    {
      title: 'Projetos Realizados',
      value: totalProjects,
      sub: `${featuredProjectsCount} em destaque na Home`,
      icon: Building2,
      href: '/admin/projetos',
      color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#E8611C] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E8611C] animate-pulse"></span>
            <span>Painel de Controlo Atlas Materials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestão integrada de produtos, categorias, projetos, destaques e pedidos de cotação.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center space-x-1.5 bg-[#E8611C] hover:bg-[#C74E13] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#E8611C]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto</span>
          </Link>

          <Link
            href="/admin/projetos/novo"
            className="inline-flex items-center space-x-1.5 bg-[#1E1E1E] hover:bg-zinc-800 text-white border border-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#E8611C]" />
            <span>+ Novo Projeto</span>
          </Link>

          <Link
            href="/admin/categorias"
            className="inline-flex items-center space-x-1.5 bg-[#1E1E1E] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Categorias</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="bg-[#141414] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-lg flex items-start justify-between transition-all duration-200 group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">{s.title}</span>
              <div className="text-3xl font-extrabold text-white group-hover:text-[#E8611C] transition-colors">
                {s.value}
              </div>
              <span className="text-[11px] text-zinc-400 block mt-1">{s.sub}</span>
            </div>
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Visitors Chart Section */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#E8611C]" />
              <span>Visitantes (Últimos 30 dias)</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Evolução do tráfego e visualizações do site
            </p>
          </div>
        </div>
        <VisitorsChart data={chartData} />
      </div>

      {/* Main Grid: Recent Products + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Latest Products */}
        <div className="lg:col-span-8 bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#E8611C]" />
                <span>Últimos Produtos Cadastrados</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Produtos mais recentes no catálogo de materiais
              </p>
            </div>
            <Link
              href="/admin/produtos"
              className="text-xs font-bold text-[#E8611C] hover:underline flex items-center space-x-1"
            >
              <span>Ver Todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Nenhum produto cadastrado ainda.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {recentProducts.map((p) => {
                const img = p.images.find((i) => i.isPrimary)?.imageUrl || p.images[0]?.imageUrl || '/logo.png';
                return (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between space-x-3 hover:bg-zinc-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] border border-zinc-700/80 overflow-hidden relative shrink-0">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                          {p.name}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                          <span className="font-medium text-zinc-300">{p.category?.name || 'Geral'}</span>
                          <span>·</span>
                          <span className="font-mono text-[#E8611C] font-semibold">{formatCurrency(p.price)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {p.isFeatured && (
                        <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#E8611C]/20 text-[#E8611C] text-[10px] font-bold">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Destaque</span>
                        </span>
                      )}

                      <Link
                        href={`/produtos/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Ver no site"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 transition-colors"
                        title="Editar produto"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Latest Projects */}
        <div className="lg:col-span-4 bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#E8611C]" />
                  <span>Projetos Recentes</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Portfólio de obras fornecidas
                </p>
              </div>
              <Link
                href="/admin/projetos"
                className="text-xs font-bold text-[#E8611C] hover:underline flex items-center space-x-1"
              >
                <span>Ver Todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Nenhum projeto cadastrado.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {recentProjects.map((proj) => {
                  const cover = proj.coverImage || proj.images[0]?.imageUrl || '/logo.png';
                  return (
                    <div
                      key={proj.id}
                      className="bg-[#1C1C1C] border border-zinc-800 rounded-xl p-3 flex items-center justify-between space-x-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-[#242424] border border-zinc-700 overflow-hidden relative shrink-0">
                          <Image
                            src={cover}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate" title={proj.title}>
                            {proj.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                            {proj.location && <span>{proj.location}</span>}
                            {proj.date && <span>· {proj.date}</span>}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/admin/projetos/${proj.id}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E8611C] hover:bg-zinc-800 transition-colors shrink-0"
                        title="Editar projeto"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <Link
              href="/admin/projetos/novo"
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#1E1E1E] hover:bg-zinc-800 text-zinc-200 hover:text-white py-2.5 rounded-xl text-xs font-bold border border-zinc-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8611C]" />
              <span>Adicionar Novo Projeto</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Quotes Table */}
      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#E8611C]" />
              <span>Últimos Pedidos de Cotação de Clientes</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Recebidos através dos formulários e calculadora de área do website
            </p>
          </div>
          <Link
            href="/admin/cotacoes"
            className="text-xs font-bold text-[#E8611C] hover:underline flex items-center space-x-1"
          >
            <span>Ver Todas as Cotações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            Nenhuma cotação recebida ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1A1A] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Itens</th>
                  <th className="px-4 py-3">Valor Estimado</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#E8611C]">
                      {q.referenceCode}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {q.customerName}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {q.customerPhone}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {q.items.length} {q.items.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-white">
                      {formatCurrency(q.estimatedTotal)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.status === 'NOVO'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : q.status === 'RESPONDIDO'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : q.status === 'CONCLUIDO'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/cotacoes/${q.id}`}
                        className="text-xs font-bold text-[#E8611C] hover:underline"
                      >
                        Detalhes →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
