import React from 'react';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { AdminLayoutShell } from './admin-layout-shell';

export const metadata = {
  title: 'Painel de Administração | Atlas Materials',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedAdmin();

  return (
    <AdminLayoutShell user={user}>
      {children}
    </AdminLayoutShell>
  );
}
