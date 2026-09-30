import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Building2, 
  Send,
  ShieldCheck
} from 'lucide-react';

export const metadata = {
  title: 'Contactos & Localização | Atlas Materials',
  description: 'Entre em contacto com o departamento comercial da Atlas Materials. Visite o nosso showroom ou envie a sua mensagem.',
};

export default function ContactosPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Atendimento Comercial
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Fale com a Atlas Materials
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Estamos prontos para atender as suas solicitações de cotação, visitas técnicas e dúvidas sobre materiais.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
              <h3 className="text-lg font-bold text-brand-900 font-display border-b border-slate-100 pb-3">
                Informações de Contacto
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-900 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Sede & Showroom</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Avenida Principal, Zona Comercial / Industrial, Maputo, Moçambique
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">WhatsApp Comercial</div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      +258 87 443 8819
                    </div>
                    <div className="text-[11px] text-slate-400">Atendimento rápido para cotações</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-900 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Telefone Geral</div>
                    <div className="text-xs text-slate-600 mt-0.5">+258 87 443 8819</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-900 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">E-mail Comercial</div>
                    <div className="text-xs text-slate-600 mt-0.5">comercial@atlasmaterials.com</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-gold-50 text-gold-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Horário de Funcionamento</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Segunda a Sexta: 08:00 - 18:00<br />
                      Sábado: 08:00 - 13:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Card */}
            <div className="p-6 rounded-2xl bg-emerald-600 text-white shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-6 h-6" />
                <h4 className="font-bold text-base">Prefere falar pelo WhatsApp?</h4>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Envie a lista de materiais ou fotografias da sua obra diretamente para os nossos consultores técnicos.
              </p>
              <a
                href="https://wa.me/258874438819"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full bg-white hover:bg-emerald-50 text-emerald-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow"
              >
                <span>Iniciar Conversa no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
              <h3 className="text-xl font-bold text-brand-900 font-display">
                Envie-nos uma Mensagem
              </h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Empresa / Gabinete
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Construtora ABC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemplo@empresa.com"
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
                      placeholder="+258 87 443 8819"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assunto
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none text-slate-800">
                    <option>Pedido de Cotação de Materiais</option>
                    <option>Parceria Comercial / Construtora</option>
                    <option>Dúvidas Técnicas sobre Produtos</option>
                    <option>Outro Assunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mensagem / Detalhes da Solicitação *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreva as suas necessidades, quantidades ou detalhes do projeto..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
