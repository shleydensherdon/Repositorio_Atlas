'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Calculator, 
  MessageCircle, 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Building2,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { PhotoUpload, UploadedPhoto } from '@/components/quote/PhotoUpload';
import { WhatsAppButton } from '@/components/quote/WhatsAppButton';
import { formatCurrency, formatArea } from '@/lib/utils';

export function QuotePageClient() {
  const router = useRouter();
  const { 
    items, 
    customer, 
    setCustomer, 
    removeItem, 
    updateQuantity, 
    updateTileCalculation, 
    clearQuote, 
    totalItemsCount, 
    estimatedTotal 
  } = useQuote();

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof customer, val: string) => {
    setCustomer((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError('Por favor adicione pelo menos um produto ao seu pedido de cotação.');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone) {
      setSubmitError('Por favor preencha os campos obrigatórios (Nome, E-mail e Telefone).');
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentsData: any[] = [];

      // 1. Upload de Fotografias se existirem
      if (uploadedPhotos.length > 0) {
        const formData = new FormData();
        uploadedPhotos.forEach((p) => {
          formData.append('files', p.file);
        });

        const uploadRes = await fetch('/api/quotes/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          attachmentsData = uploadJson.files || [];
        }
      }

      // 2. Submeter Cotação
      const payload = {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerWhatsapp: customer.whatsapp || customer.phone,
        companyName: customer.companyName,
        projectType: customer.projectType,
        location: customer.location,
        notes: customer.notes,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity,
          unit: i.unit,
          calculatedArea: i.calculatedArea || null,
          wastePercentage: i.wastePercentage ?? 10,
          unitPrice: i.price || null,
          subtotal: i.subtotal || null,
        })),
        attachments: attachmentsData,
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar cotação');
      }

      // Limpar cesto e redirecionar para página de sucesso
      clearQuote();
      router.push(`/cotacao/sucesso/${data.referenceCode}`);
    } catch (err: any) {
      console.error('Erro na submissão:', err);
      setSubmitError(err.message || 'Ocorreu um erro ao submeter o seu pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Orçamento Personalizado
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Minha Cotação de Materiais
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Reveja os materiais selecionados, ajuste metragens com a calculadora e envie o seu pedido formal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 font-display">A sua cotação ainda está vazia</h3>
            <p className="text-sm text-slate-500">
              Navegue pelo nosso catálogo de louças sanitárias, portas, tijoleiras e misturadoras para adicionar os produtos que necessita.
            </p>
            <div className="pt-4">
              <Link
                href="/produtos"
                className="inline-flex items-center space-x-2 bg-brand-900 hover:bg-brand-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow"
              >
                <span>Explorar Produtos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Items List & Project Pictures Upload */}
            <div className="lg:col-span-7 space-y-8">
              {/* Product Items Box */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-brand-900" />
                    <h3 className="font-bold text-brand-900 text-lg font-display">
                      Itens no Pedido ({totalItemsCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={clearQuote}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Esvaziar Cesto
                  </button>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative shrink-0">
                          <Image
                            src={item.imageUrl || '/logo.png'}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {item.productName}
                              </h4>
                              {item.sku && (
                                <span className="text-[11px] font-mono text-slate-400">
                                  Ref: {item.sku}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="text-xs text-slate-500">
                              Unitário: <span className="font-semibold text-slate-700">{formatCurrency(item.price)}</span>
                              {item.isPerSquareMeter && ' /m²'}
                            </div>
                            <div className="text-sm font-extrabold text-brand-900 font-display">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Se for produto vendido por m², permitir edição de medidas em tempo real */}
                      {item.isPerSquareMeter ? (
                        <div className="p-3.5 rounded-xl bg-gold-50/50 border border-gold-200/80 space-y-2.5">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-gold-900">
                            <Calculator className="w-3.5 h-3.5 text-gold-600" />
                            <span>Ajuste de Metragem & Desperdício</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                                Comprimento (m)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={item.length ?? 5}
                                onChange={(e) =>
                                  updateTileCalculation(
                                    item.id,
                                    parseFloat(e.target.value) || 0,
                                    item.width ?? 4,
                                    item.wastePercentage ?? 10
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                                Largura (m)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={item.width ?? 4}
                                onChange={(e) =>
                                  updateTileCalculation(
                                    item.id,
                                    item.length ?? 5,
                                    parseFloat(e.target.value) || 0,
                                    item.wastePercentage ?? 10
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                                Desperdício (%)
                              </label>
                              <select
                                value={item.wastePercentage ?? 10}
                                onChange={(e) =>
                                  updateTileCalculation(
                                    item.id,
                                    item.length ?? 5,
                                    item.width ?? 4,
                                    parseFloat(e.target.value) || 10
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                              >
                                <option value={10}>10% (Reto)</option>
                                <option value={15}>15% (Diagonal)</option>
                                <option value={20}>20% (Espinha)</option>
                              </select>
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-brand-900 flex justify-between pt-1">
                            <span>Área calculada c/ cortes:</span>
                            <span className="font-bold text-gold-700">{formatArea(item.calculatedArea || 0)}</span>
                          </div>
                        </div>
                      ) : (
                        /* Controlo de quantidade comum */
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-xs text-slate-500 font-medium">Quantidade:</span>
                          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 text-slate-600 hover:text-brand-900 rounded"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold px-2">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-600 hover:text-brand-900 rounded"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload de Fotos do Espaço / Projeto */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
                <PhotoUpload
                  onPhotosChange={setUploadedPhotos}
                  maxFiles={5}
                  maxSizeMb={10}
                />
              </div>
            </div>

            {/* Right Column: Customer Info & Submission Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-5">
                <h3 className="font-bold text-brand-900 text-lg font-display border-b border-slate-100 pb-3">
                  Dados do Cliente & Obra
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Arq. Carlos Silva / Dra. Ana"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="cliente@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+244 923 000 000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Empresa / Gabinete (Opcional)
                      </label>
                      <input
                        type="text"
                        value={customer.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Ex: Construtora Luanda"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Localização da Obra
                      </label>
                      <input
                        type="text"
                        value={customer.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Ex: Talatona, Luanda"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Projeto
                    </label>
                    <select
                      value={customer.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none text-slate-800"
                    >
                      <option value="Residencial">Residencial Particular</option>
                      <option value="Condomínio">Condomínio / Moradias</option>
                      <option value="Comercial">Comercial / Escritórios</option>
                      <option value="Hotelaria">Hotelaria / Restauração</option>
                      <option value="Outro">Outro Tipo de Empreendimento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Observações / Requisitos Específicos
                    </label>
                    <textarea
                      rows={3}
                      value={customer.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Indique prazos pretendidos, restrições de entrega ou acabamentos pretendidos..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Produtos adicionados:</span>
                    <span className="font-semibold">{totalItemsCount}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Estimado:</span>
                    <span className="text-brand-900 font-display">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submission Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>A submeter pedido...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submeter Pedido de Cotação Oficial</span>
                      </>
                    )}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">ou</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <WhatsAppButton
                    className="w-full"
                    variant="secondary"
                    buttonText="Enviar Cotação Imediata por WhatsApp"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
