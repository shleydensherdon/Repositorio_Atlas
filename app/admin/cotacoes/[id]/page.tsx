import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { QuoteDetailClient } from './quote-detail-client';

export const revalidate = 0;

interface QuotePageProps {
  params: {
    id: string;
  };
}

export default async function AdminQuoteDetailPage({ params }: QuotePageProps) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      attachments: true,
    },
  });

  if (!quote) {
    notFound();
  }

  return <QuoteDetailClient quote={quote} />;
}
