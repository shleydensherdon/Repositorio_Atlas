'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuoteDrawer } from '@/components/quote/QuoteDrawer';
import { WhatsAppButton } from '@/components/quote/WhatsAppButton';

export function ConditionalPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuoteDrawer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
