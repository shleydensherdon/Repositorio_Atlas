import React from 'react';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { AdminUsersClient } from './admin-users-client';

export const revalidate = 0;

export default async function AdminAdministradoresPage() {
  const currentAdmin = await getAuthenticatedAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminUsersClient
      initialUsers={users}
      currentUserId={currentAdmin?.id || ''}
    />
  );
}
