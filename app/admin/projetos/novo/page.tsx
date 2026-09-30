import React from 'react';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const revalidate = 0;

export default async function NovoProjetoPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <ProjectForm
      availableProducts={products}
      isEditing={false}
    />
  );
}
