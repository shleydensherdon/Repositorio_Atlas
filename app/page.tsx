import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Building2, 
  ShoppingBag, 
  MessageCircle, 
  Layers,
  ChevronRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { HeroBackground } from '@/components/home/HeroBackground';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featuredProducts, solutions, projects] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
        images: { orderBy: { orderIndex: 'asc' } },
      },
      take: 8,
    }),
    prisma.solution.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      take: 6,
    }),
    prisma.project.findMany({
      where: { isActive: true, isFeatured: true },
      take: 3,
    }),
  ]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO BANNER DE ALTO IMPACTO */}
      <section className="relative min-h-[42rem] overflow-hidden bg-slate-950 py-20 text-white lg:min-h-[46rem] lg:py-28">
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex min-h-[38rem] items-center">
            <div className="max-w-4xl space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8611C]/10 border border-[#E8611C]/30 text-[#E8611C] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Materiais para obra e acabamento</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.96] text-white">
                Soluções Integradas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9E72] via-[#E8611C] to-[#C74E13]">Projectos Comerciais e Residenciais</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Da especificação e fornecimento à entrega e apoio técnico. Um único parceiro para produtos, sistemas, procurement e serviços.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/produtos"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white font-bold px-7 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/258874438819?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20para%20o%20meu%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-4 rounded-xl backdrop-blur-sm transition-all active:scale-95 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Cotação Imediata WhatsApp</span>
                </a>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white">+1.500</div>
                  <div className="text-xs text-slate-400">Obras Fornecidas</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gold-400">100%</div>
                  <div className="text-xs text-slate-400">Produtos Certificados</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">24h</div>
                  <div className="text-xs text-slate-400">Resposta a Cotações</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS DE PRODUTOS DINÂMICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="section-kicker text-xs font-bold text-[#E8611C] uppercase tracking-widest">
              LINHAS DE PRODUTOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
              Categorias em Destaque
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore as nossas linhas de materiais estruturadas para o seu projeto.
            </p>
          </div>

          <Link
            href="/categorias"
            className="inline-flex items-center space-x-1 text-sm font-bold text-[#E8611C] hover:underline mt-4 md:mt-0"
          >
            <span>Ver Todas as Categorias</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.imageUrl || '/logo.png'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF9E72] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-300">
                    {cat._count.products} {cat._count.products === 1 ? 'produto' : 'produtos'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-xs font-bold text-[#E8611C]">
                <span>Explorar Categoria</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PRODUTOS EM DESTAQUE COM FOTOGRAFIAS REAIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E8611C] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seleção Premium</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Materiais de topo com pronta entrega e assistência técnica especializada.
            </p>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all mt-4 md:mt-0 shadow-sm"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Nenhum produto destacado de momento. Aceda ao Painel ADM para selecionar produtos em destaque.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                sku={prod.sku}
                price={prod.price}
                unit={prod.unit}
                isPerSquareMeter={prod.isPerSquareMeter}
                dimensions={prod.dimensions}
                isAvailable={prod.isAvailable}
                isFeatured={prod.isFeatured}
                category={prod.category}
                brand={prod.brand}
                images={prod.images}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. SOLUÇÕES ATLAS MATERIALS */}
      <section className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FFB38A] uppercase tracking-widest">
              Soluções Integradas
            </span>
            <h2 className="text-3xl font-bold font-display mt-2">
              Da Fundação aos Acabamentos Mais Refinados
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Fornecemos soluções completas de engenharia e arquitetura para projetos residenciais, comerciais e industriais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => (
              <div
                key={sol.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E8611C]/10 text-[#E8611C] flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFB38A] transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sol.shortDescription}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <Link
                    href={`/solucoes/${sol.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FFB38A] hover:text-white"
                  >
                    <span>Saber Mais</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROJETOS E OBRAS FORNECIDAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#E8611C] uppercase tracking-widest">
              Portfólio de Sucesso
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
              Obras & Projetos de Referência
            </h2>
          </div>
          <Link
            href="/projetos"
            className="inline-flex items-center space-x-1 text-sm font-bold text-brand-700 hover:text-brand-900 mt-2 md:mt-0"
          >
            <span>Ver Todos os Projetos</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/projetos/${proj.slug}`}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <Image
                  src={proj.coverImage || '/logo.png'}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {proj.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-semibold text-[#E8611C]">{proj.location}</div>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-0.5 group-hover:text-[#E8611C] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                    {proj.description}
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-[#E8611C] flex items-center space-x-1">
                  <span>Ver Detalhes do Fornecimento</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-brand-950 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-brand-800">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2),transparent_70%)] pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="inline-flex items-center space-x-2 text-[#FFB38A] text-xs font-bold uppercase tracking-widest">
              <MessageCircle className="w-4 h-4" />
              <span>Atendimento Comercial Imediato</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Tem um projeto ou obra em curso? Peça já a sua cotação sem compromisso.
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              A nossa equipa técnica responde em menos de 24 horas com as melhores condições de fornecimento, mapas de quantidades e prazos de entrega em obra.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/cotacao"
                className="inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white font-bold px-6 py-3.5 rounded-xl shadow transition-all active:scale-95 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Montar Cotação no Website</span>
              </Link>

              <a
                href="https://wa.me/258874438819?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20produtos%20e%20servi%C3%A7os."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow transition-all active:scale-95 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
