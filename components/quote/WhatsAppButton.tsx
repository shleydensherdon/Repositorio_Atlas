'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useQuote, QuoteCartItem, CustomerInfo } from '@/context/QuoteContext';
import { formatCurrency, formatArea } from '@/lib/utils';

interface WhatsAppButtonProps {
  referenceCode?: string;
  className?: string;
  overrideCustomer?: Partial<CustomerInfo>;
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'floating';
}

export function WhatsAppButton({
  referenceCode,
  className = '',
  overrideCustomer,
  buttonText = 'Enviar Cotação por WhatsApp',
  variant = 'primary',
}: WhatsAppButtonProps) {
  const { items, customer, estimatedTotal } = useQuote();
  const currentCustomer = { ...customer, ...overrideCustomer };
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '258874438819';

  const generateWhatsAppUrl = () => {
    let msg = `🏗️ *PEDIDO DE COTAÇÃO - ATLAS MATERIALS*\n`;
    if (referenceCode) {
      msg += `📋 *Referência:* ${referenceCode}\n`;
    }
    msg += `📅 *Data:* ${new Date().toLocaleDateString('pt-PT')}\n\n`;

    if (currentCustomer.name) {
      msg += `👤 *Cliente:* ${currentCustomer.name}`;
      if (currentCustomer.companyName) msg += ` (${currentCustomer.companyName})`;
      msg += `\n`;
      if (currentCustomer.phone) msg += `📞 *Telefone:* ${currentCustomer.phone}\n`;
      if (currentCustomer.email) msg += `📧 *E-mail:* ${currentCustomer.email}\n`;
      if (currentCustomer.location) msg += `📍 *Localização:* ${currentCustomer.location}\n`;
      if (currentCustomer.projectType) msg += `🏢 *Tipo de Projeto:* ${currentCustomer.projectType}\n`;
      msg += `\n`;
    }

    if (items.length > 0) {
      msg += `📦 *ITENS DA COTAÇÃO:*\n`;
      items.forEach((item, i) => {
        msg += `${i + 1}. *${item.productName}*\n`;
        if (item.isPerSquareMeter && item.calculatedArea) {
          msg += `   • Metragem: ${formatArea(item.calculatedArea)} (Dimensões: ${item.length}m × ${item.width}m + ${item.wastePercentage}% desperdício)\n`;
        } else {
          msg += `   • Quantidade: ${item.quantity} ${item.unit}\n`;
        }
        if (item.subtotal) {
          msg += `   • Subtotal Estimado: ${formatCurrency(item.subtotal)}\n`;
        }
      });
      msg += `\n💰 *TOTAL ESTIMADO:* ${formatCurrency(estimatedTotal)}\n`;
    } else {
      msg += `Olá, gostaria de solicitar uma cotação e informações de catálogo da Atlas Materials.\n`;
    }

    if (currentCustomer.notes) {
      msg += `\n📝 *Observações do Cliente:* ${currentCustomer.notes}\n`;
    }

    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encoded}`;
  };

  if (variant === 'floating') {
    return (
      <a
        href={generateWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out px-0 group-hover:px-2 text-sm font-bold">
          Fale Connosco
        </span>
      </a>
    );
  }

  return (
    <a
      href={generateWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center space-x-2 font-bold rounded-xl transition-all shadow-md active:scale-95 ${
        variant === 'primary'
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-3 px-4 text-sm'
      } ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>{buttonText}</span>
    </a>
  );
}
