import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const revalidate = 0;

export default async function EditarProjetoPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, products] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        products: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        category: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const initialData = {
    id: project.id,
    title: project.title,
    date: project.date || '',
    location: project.location || '',
    category: project.category || 'Residencial',
    description: project.description || '',
    isFeatured: project.isFeatured,
    isActive: project.isActive,
    images: project.images.map((img) => ({
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary,
      altText: img.altText || undefined,
      orderIndex: img.orderIndex,
    })),
    productIds: project.products.map((p) => p.productId),
  };

  return (
    <ProjectForm
      initialData={initialData}
      availableProducts={products}
      isEditing={true}
    />
  );
}
