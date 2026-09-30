import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminFeaturedClient } from './admin-featured-client';

export const revalidate = 0;

export default async function AdminDestaquesPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: { orderIndex: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return <AdminFeaturedClient initialProducts={products} />;
}
