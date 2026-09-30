import React from 'react';
import { QuotePageClient } from './quote-page-client';

export const metadata = {
  title: 'Minha Cotação de Materiais | Atlas Materials',
  description: 'Adicione produtos, calcule metros quadrados de pisos e louças sanitárias e solicite uma cotação formal à Atlas Materials.',
};

export default function CotacaoPage() {
  return <QuotePageClient />;
}
