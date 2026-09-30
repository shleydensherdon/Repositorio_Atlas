import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  FileText, 
  Calendar, 
  Building2, 
  ShoppingBag,
  Clock
} from 'lucide-react';
import { formatCurrency, formatArea } from '@/lib/utils';

export const revalidate = 0;

interface SuccessPageProps {
  params: {
    ref: string;
  };
}

export default async function QuoteSuccessPage({ params }: SuccessPageProps) {
  const quote = await prisma.quote.findUnique({
    where: { referenceCode: params.ref },
    include: {
      items: true,
      attachments: true,
    },
  });

  if (!quote) {
    notFound();
  }

  // Prepara link de WhatsApp com a referência
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '258874438819';
  const whatsappMsg = `Olá Atlas Materials! Acabei de submeter o pedido de cotação *${quote.referenceCode}* no vosso website em nome de *${quote.customerName}*. Gostaria de confirmar a receção.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto animate-in zoom-in-75">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
            Pedido Registado com Sucesso
          </span>
          <h1 className="text-3xl font-extrabold text-brand-900 font-display">
            Obrigado pelo seu Pedido de Cotação!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            A sua solicitação foi recebida pela nossa equipa comercial. Irá receber uma resposta detalhada em menos de 24 horas úteis.
          </p>
        </div>

        {/* Reference Code Box */}
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 max-w-md mx-auto space-y-1">
          <div className="text-xs text-brand-900 font-semibold">Código de Referência da Cotação:</div>
          <div className="text-2xl font-mono font-extrabold text-brand-950 tracking-wider">
            {quote.referenceCode}
          </div>
        </div>

        {/* WhatsApp Fast-Track Button */}
        <div className="pt-2 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all active:scale-95 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Acompanhar Cotação no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Summary of items */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-brand-900 text-base font-display border-b border-slate-100 pb-3">
          Resumo do Pedido #{quote.referenceCode}
        </h3>

        <div className="divide-y divide-slate-100 space-y-3">
          {quote.items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800">{item.productName}</span>
                {item.calculatedArea && (
                  <div className="text-[11px] text-slate-500">
                    Área: {formatArea(item.calculatedArea)} (+{item.wastePercentage}% corte)
                  </div>
                )}
                {!item.calculatedArea && (
                  <div className="text-[11px] text-slate-500">
                    Quantidade: {item.quantity} {item.unit}
                  </div>
                )}
              </div>
              <div className="font-extrabold text-brand-900">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-800">Total Estimado:</span>
          <span className="text-lg font-extrabold text-brand-900 font-display">
            {formatCurrency(quote.estimatedTotal)}
          </span>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-brand-900"
        >
          <span>Voltar à Página Principal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
