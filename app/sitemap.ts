import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://atlasmaterials.com';

  const [products, categories, solutions, projects] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.solution.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = [
    '',
    '/sobre',
    '/produtos',
    '/categorias',
    '/solucoes',
    '/projetos',
    '/marcas',
    '/contactos',
    '/cotacao',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/produtos/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/categorias/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
