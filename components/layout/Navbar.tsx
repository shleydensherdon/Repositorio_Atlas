'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bath,
  ChevronDown,
  DoorOpen,
  Droplets,
  Hammer,
  Menu,
  Paintbrush,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Lock,
  X,
  Layers,
} from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { cn } from '@/lib/utils';

type DropdownKey = 'products' | 'solutions';

type NavItem = {
  name: string;
  href: string;
  icon: typeof DoorOpen;
};

type NavigationCategory = {
  name: string;
  slug: string;
};

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Sobre Nós', href: '/sobre' },
  { name: 'Projetos', href: '/projetos' },
  { name: 'Contactos', href: '/contactos' },
];

const baseProductLinks: NavItem[] = [
  { name: 'Portas', href: '/categorias/portas', icon: DoorOpen },
  { name: 'Soluções para Casas de Banho', href: '/categorias/loica-sanitaria', icon: Bath },
  { name: 'Impermeabilização', href: '/solucoes/impermeabilizacao', icon: Droplets },
  { name: 'Materiais de Construção', href: '/produtos', icon: Hammer },
  { name: 'Produtos Saint-Gobain', href: '/marcas', icon: ShieldCheck },
];

const solutionLinks: NavItem[] = [
  { name: 'Construção', href: '/solucoes/construcao', icon: Hammer },
  { name: 'Renovação', href: '/solucoes/renovacao', icon: RefreshCw },
  { name: 'Impermeabilização', href: '/solucoes/impermeabilizacao', icon: Droplets },
  { name: 'Acabamentos', href: '/solucoes/acabamentos', icon: Paintbrush },
  { name: 'Soluções para Casas de Banho', href: '/categorias/loica-sanitaria', icon: Bath },
];

function DropdownMenu({
  label,
  items,
  dropdownKey,
  openDropdown,
  setOpenDropdown,
  isLinkActive,
}: {
  label: string;
  items: NavItem[];
  dropdownKey: DropdownKey;
  openDropdown: DropdownKey | null;
  setOpenDropdown: (key: DropdownKey | null) => void;
  isLinkActive: (href: string) => boolean;
}) {
  const isOpen = openDropdown === dropdownKey;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpenDropdown(dropdownKey)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <button
        type="button"
        onClick={() => setOpenDropdown(isOpen ? null : dropdownKey)}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
          isOpen || isLinkActive('/produtos') || isLinkActive('/solucoes')
            ? 'bg-white/10 text-white'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        )}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-72 rounded-2xl border border-white/10 bg-black p-2 shadow-2xl shadow-black/30">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            {label === 'Produtos' ? 'Linhas de produto' : 'Áreas de solução'}
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#E8611C]" />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsDrawerOpen } = useQuote();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [productLinks, setProductLinks] = useState<NavItem[]>(baseProductLinks);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/navigation', { cache: 'no-store' });
        if (!response.ok) return;

        const data: { categories: NavigationCategory[] } = await response.json();
        if (!active) return;

        const categoryLinks = data.categories.map((category) => ({
          name: category.name,
          href: `/categorias/${category.slug}`,
          icon: Layers,
        }));
        const links = [...categoryLinks, ...baseProductLinks].filter(
          (item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index
        );
        setProductLinks(links);
      } catch {
        // Keep the static links available if the navigation request fails.
      }
    };

    const refreshCategories = () => loadCategories();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'atlas-navigation-version') refreshCategories();
    };
    loadCategories();
    window.addEventListener('atlas-navigation-changed', refreshCategories);
    window.addEventListener('storage', handleStorage);
    return () => {
      active = false;
      window.removeEventListener('atlas-navigation-changed', refreshCategories);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const isLinkActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className={cn(
        'w-full border-b transition-all duration-300',
        isScrolled
          ? 'border-white/10 bg-black/95 py-2 shadow-lg shadow-black/30 backdrop-blur-md'
          : 'border-white/10 bg-black py-3'
      )}>
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Atlas Materials - Início">
            <Image
              src="/logo.png"
              alt="Atlas Materials"
              width={220}
              height={76}
              className="h-[3.25rem] w-auto object-contain transition-transform duration-300 hover:scale-[1.02] sm:h-[3.75rem]"
              priority
            />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'relative rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  isLinkActive(link.href) ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {link.name}
                {isLinkActive(link.href) && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#E8611C]" />}
              </Link>
            ))}
            <DropdownMenu label="Produtos" items={productLinks} dropdownKey="products" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} isLinkActive={isLinkActive} />
            <DropdownMenu label="Soluções" items={solutionLinks} dropdownKey="solutions" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} isLinkActive={isLinkActive} />
            
            <Link href="/cotacao" className="ml-2 inline-flex items-center gap-2 rounded-xl bg-[#E8611C] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-950/30 transition-all hover:bg-[#C74E13] hover:shadow-lg active:scale-[0.98]">
              <ShoppingBag className="h-4 w-4" />
              Pedir Cotação
            </Link>

            {/* Direct Admin Access Button in New Tab */}
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/15 hover:text-white"
              title="Abrir Painel Administrativo numa nova aba"
            >
              <Lock className="h-3.5 w-3.5 text-[#E8611C]" />
              <span>Painel ADM</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              title="Painel ADM"
            >
              <Lock className="h-5 w-5 text-[#E8611C]" />
            </Link>
            <button type="button" onClick={() => setIsDrawerOpen(true)} aria-label="Abrir a minha cotação" className="relative rounded-lg p-2 text-white transition-colors hover:bg-white/10">
              <ShoppingBag className="h-5 w-5" />
              {totalItemsCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#E8611C] px-1 text-center text-[10px] font-bold text-white">{totalItemsCount}</span>}
            </button>
            <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} className="rounded-lg p-2 text-white transition-colors hover:bg-white/10">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-3 space-y-2 border-t border-white/10 bg-black px-5 pb-5 pt-4 animate-in slide-in-from-top-4 duration-200 lg:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => <Link key={link.name} href={link.href} className={cn('block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', isLinkActive(link.href) ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')}>{link.name}</Link>)}
            </div>
            {[{ label: 'Produtos', items: productLinks }, { label: 'Soluções', items: solutionLinks }].map((group) => (
              <div key={group.label} className="border-t border-white/10 pt-3">
                <span className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">{group.label}</span>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {group.items.map((item) => { const Icon = item.icon; return <Link key={item.name} href={item.href} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"><Icon className="h-4 w-4 text-[#FFB38A]" />{item.name}</Link>; })}
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <Link href="/cotacao" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8611C] py-3 text-sm font-bold text-white shadow-md hover:bg-[#C74E13]"><ShoppingBag className="h-4 w-4" />Pedir Cotação</Link>
              <Link href="/admin" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white"><Lock className="h-3.5 w-3.5 text-[#E8611C]" />Aceder ao Painel ADM (Nova Aba)</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
