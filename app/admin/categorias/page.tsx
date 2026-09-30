import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminCategoriesClient } from './admin-categories-client';

export const revalidate = 0;

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <AdminCategoriesClient initialCategories={categories} />
  );
}
