import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Award,
  ArrowRight
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-300 pt-16 pb-12 border-t border-brand-800">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-brand-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-900/50 border border-brand-800/60">
            <div className="p-3 rounded-lg bg-gold-500/10 text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Qualidade Certificada</h4>
              <p className="text-xs text-slate-400 mt-1">
                Materiais rigorosamente selecionados e conformes com padrões técnicos internacionais.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-900/50 border border-brand-800/60">
            <div className="p-3 rounded-lg bg-gold-500/10 text-gold-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Entrega Segura na Obra</h4>
              <p className="text-xs text-slate-400 mt-1">
                Logística especializada para entregas pontuais em projetos residenciais e grandes empreitadas.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-900/50 border border-brand-800/60">
            <div className="p-3 rounded-lg bg-gold-500/10 text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Garantia & Assistência</h4>
              <p className="text-xs text-slate-400 mt-1">
                Suporte técnico especializado na especificação de acabamentos e cálculo de quantidades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <div className="relative h-12 w-48 rounded-lg overflow-hidden flex items-center justify-center px-2">
                <Image 
                  src="/logo.png" 
                  alt="Atlas Materials" 
                  width={168} 
                  height={44} 
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              A Atlas Materials é o seu parceiro de confiança para o fornecimento de materiais de construção, acabamentos, sanitários, alumínio e soluções para projectos comerciais e residenciais. Atendemos promotores, construtoras, arquitectos e particulares.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/258874438819"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento Direto no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase font-display border-b border-brand-800 pb-2">
              Website
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-gold-400 transition-colors">Sobre a Atlas</Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-gold-400 transition-colors">Produtos</Link>
              </li>
              <li>
                <Link href="/solucoes" className="hover:text-gold-400 transition-colors">Soluções</Link>
              </li>
              <li>
                <Link href="/projetos" className="hover:text-gold-400 transition-colors">Projectos</Link>
              </li>
              <li>
                <Link href="/marcas" className="hover:text-gold-400 transition-colors">Marcas</Link>
              </li>
              <li>
                <Link href="/contactos" className="hover:text-gold-400 transition-colors">Contactos</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Categorias */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase font-display border-b border-brand-800 pb-2">
              Categorias
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/categorias/loica-sanitaria" className="hover:text-gold-400 transition-colors">Loiça Sanitária</Link>
              </li>
              <li>
                <Link href="/categorias/portas" className="hover:text-gold-400 transition-colors">Portas & Painéis</Link>
              </li>
              <li>
                <Link href="/categorias/tijoleiras" className="hover:text-gold-400 transition-colors">Tijoleiras & Porcelanatos</Link>
              </li>
              <li>
                <Link href="/categorias/torneiras" className="hover:text-gold-400 transition-colors">Torneiras & Misturadoras</Link>
              </li>
              <li>
                <Link href="/cotacao" className="hover:text-gold-400 transition-colors font-medium text-gold-400">Calculadora de Cotação</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contacto Direto */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase font-display border-b border-brand-800 pb-2">
              Fale Connosco
            </h5>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Av. Marginal, 809, The Assos, Costa do Sol, Maputo, Moçambique</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+258 87 443 8819</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>atlasmaterialslab@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Segunda a Sexta: 08h – 17h<br />Sábado: 08h – 13h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-brand-900 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} Atlas Materials. Todos os direitos reservados.
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/sobre" className="hover:text-slate-400">Privacidade & Termos</Link>
          <Link href="/contactos" className="hover:text-slate-400">Suporte Técnico</Link>
          <Link href="/admin/login" className="hover:text-gold-400">Acesso Restrito</Link>
        </div>
      </div>
    </footer>
  );
}
