import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Package, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) return { title: 'Projeto Não Encontrado | Atlas Materials' };

  return {
    title: `${project.title} | Projetos Atlas Materials`,
    description: project.description || `Conheça o projeto ${project.title} fornecido pela Atlas Materials.`,
  };
}

export default async function ProjetoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      products: {
        include: {
          product: {
            include: {
              category: { select: { name: true, slug: true } },
              brand: { select: { name: true } },
              images: { orderBy: { orderIndex: 'asc' } },
            },
          },
        },
      },
    },
  });

  if (!project || !project.isActive) {
    notFound();
  }

  const coverImage = project.coverImage || project.images.find(i => i.isPrimary)?.imageUrl || project.images[0]?.imageUrl || '/logo.png';
  const galleryImages = project.images.length > 0 ? project.images : [{ imageUrl: coverImage, altText: project.title }];

  return (
    <div className="space-y-12 pb-24">
      {/* Top Breadcrumb & Hero */}
      <section className="bg-brand-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,97,28,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Link
            href="/projetos"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar a Todos os Projetos</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.category && (
                <span className="px-3 py-1 rounded-full bg-[#E8611C]/20 border border-[#E8611C]/40 text-[#E8611C] text-xs font-bold uppercase tracking-wider">
                  {project.category}
                </span>
              )}
              {project.isFeatured && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Projeto em Destaque</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-300 pt-2">
              {project.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#E8611C]" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#E8611C]" />
                  <span>Conclusão em {project.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cover & Gallery */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Cover Showcase */}
            <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl relative aspect-video w-full">
              <Image
                src={coverImage}
                alt={project.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#E8611C]" />
                <span>Sobre a Obra e Fornecimento</span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed whitespace-pre-line">
                {project.description || 'Projeto fornecido e acompanhado com a garantia e assistência técnica da Atlas Materials.'}
              </p>
            </div>

            {/* Gallery Grid */}
            {galleryImages.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900">
                  Galeria de Fotografias da Obra ({galleryImages.length} imagens)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden aspect-4/3 bg-zinc-100 border border-zinc-200 relative group shadow-sm hover:shadow-md transition-all"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={img.altText || `${project.title} - Foto ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Sidebar & Contact CTA */}
          <div className="lg:col-span-4 space-y-6">
            {/* Project Summary Box */}
            <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-7 border border-zinc-800 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
                Ficha Técnica do Fornecimento
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Empreendimento</span>
                  <span className="font-bold text-white text-sm">{project.title}</span>
                </div>

                {project.location && (
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Localização</span>
                    <span className="font-semibold text-zinc-200">{project.location}</span>
                  </div>
                )}

                {project.category && (
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Segmento</span>
                    <span className="font-semibold text-zinc-200">{project.category}</span>
                  </div>
                )}

                {project.date && (
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Ano de Execução</span>
                    <span className="font-semibold text-zinc-200">{project.date}</span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-400 block mb-0.5">Garantia Técnica</span>
                  <span className="font-semibold text-[#E8611C]">100% Homologado Atlas Materials</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <a
                  href={`https://wa.me/258874438819?text=Ol%C3%A1%2C%20vi%20o%20projeto%20"${encodeURIComponent(project.title)}"%20no%20website%20da%20Atlas%20Materials%20e%20gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20semelhante.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow transition-all active:scale-95 text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotação para Obra Similar</span>
                </a>

                <Link
                  href="/cotacao"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#E8611C] hover:bg-[#C74E13] text-white font-bold py-3.5 px-4 rounded-xl shadow transition-all active:scale-95 text-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pedir Orçamento Completo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Linked Products Section */}
        {project.products.length > 0 && (
          <div className="mt-16 space-y-6 pt-12 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#E8611C] uppercase tracking-widest">
                  Materiais Fornecidos
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 mt-1">
                  Produtos Utilizados nesta Obra
                </h2>
              </div>
              <Link
                href="/produtos"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#E8611C] hover:underline"
              >
                <span>Ver todo o catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.products.map(({ product }) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  sku={product.sku}
                  price={product.price}
                  unit={product.unit}
                  isPerSquareMeter={product.isPerSquareMeter}
                  dimensions={product.dimensions}
                  isAvailable={product.isAvailable}
                  isFeatured={product.isFeatured}
                  category={product.category}
                  brand={product.brand}
                  images={product.images}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
