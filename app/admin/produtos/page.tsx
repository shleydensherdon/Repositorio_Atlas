import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminProductsClient } from './admin-products-client';

export const revalidate = 0; // Always fresh in admin

export default async function AdminProdutosPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true } },
        images: { orderBy: { orderIndex: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { orderIndex: 'asc' },
    }),
  ]);

  return (
    <AdminProductsClient
      initialProducts={products}
      categories={categories}
    />
  );
}
