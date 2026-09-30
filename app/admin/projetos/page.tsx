import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminProjectsClient } from './admin-projects-client';

export const revalidate = 0;

export default async function AdminProjetosPage() {
  const projects = await prisma.project.findMany({
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      products: { include: { product: { select: { name: true } } } },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return <AdminProjectsClient initialProjects={projects} />;
}
