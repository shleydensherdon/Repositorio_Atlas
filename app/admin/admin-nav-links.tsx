'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Sparkles, 
  Building2, 
  Settings, 
  FileText,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Categorias', href: '/admin/categorias', icon: Layers },
    { name: 'Produtos em Destaque', href: '/admin/destaques', icon: Sparkles },
    { name: 'Projetos', href: '/admin/projetos', icon: Building2 },
    { name: 'Pedidos de Cotação', href: '/admin/cotacoes', icon: FileText },
    { name: 'Administradores', href: '/admin/administradores', icon: Users },
    { name: 'Configurações', href: '/admin/definicoes', icon: Settings },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact || href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isLinkActive(link.href, link.exact);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150",
              active
                ? "bg-[#E8611C] text-white shadow-lg shadow-[#E8611C]/20 font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
            )}
          >
            <Icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-zinc-400")} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
