import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Users, 
  Target, 
  Eye, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export const metadata = {
  title: 'Sobre a Atlas Materials | Tradição, Rigor e Excelência',
  description: 'Conheça a história, a missão e os padrões de qualidade da Atlas Materials no fornecimento de louças sanitárias, cerâmicas e acabamentos.',
};

export default function SobrePage() {
  const pillars = [
    {
      icon: Award,
      title: 'Excelência & Rigor Técnico',
      desc: 'Seleção minuciosa de louças cerâmicas vitrificadas, porcelanatos retificados e metais sanitários de alto padrão internacional.',
    },
    {
      icon: ShieldCheck,
      title: 'Garantia Comprovada',
      desc: 'Compromisso com durabilidade, resistência mecânica, acabamento impecável e assistência técnica pós-venda em todas as linhas.',
    },
    {
      icon: Truck,
      title: 'Logística Eficiente',
      desc: 'Capacidade de fornecimento ágil e seguro para obras residenciais, condomínios privados e grandes empreendimentos comerciais.',
    },
    {
      icon: Users,
      title: 'Consultoria Especializada',
      desc: 'Apoio técnico a arquitetos, engenheiros e construtores na especificação de mapas de quantidades e cálculo de áreas e desperdício.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            A Nossa Identidade
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
            Sobre a Atlas Materials
          </h1>
          <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
            Construímos relações duradouras com base na confiança, na solidez dos nossos materiais e na excelência do serviço aos nossos clientes e parceiros.
          </p>
        </div>
      </section>

      {/* Quem Somos / História */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              Liderança & Confiança
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 font-display">
              Referência no Fornecimento de Materiais e Acabamentos
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              A <strong>Atlas Materials</strong> nasceu com a missão de elevar o padrão da construção civil e do design de interiores, disponibilizando um catálogo rigorosamente selecionado de louças sanitárias, porcelanatos de grande formato, torneiras de precisão e portas maciças.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Comercializamos soluções completas adaptadas às exigências climáticas e arquitetónicas modernas, garantindo aos nossos clientes produtos de elevada durabilidade e beleza estética intemporal.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-brand-900 font-display">+10 Anos</div>
                <div className="text-xs text-slate-500 mt-0.5">Experiência no Setor</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-gold-600 font-display">100%</div>
                <div className="text-xs text-slate-500 mt-0.5">Satisfação de Clientes</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] bg-brand-900">
              <Image
                src="/uploads/products/loica-sanitaria/20260914_172849_001.webp"
                alt="Instalações e Materiais Atlas"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 font-display">A Nossa Missão</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fornecer materiais de construção e acabamentos com o mais elevado padrão de qualidade, garantindo soluções sustentáveis, aconselhamento técnico rigoroso e entregas pontuais que assegurem o sucesso de cada obra.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 font-display">A Nossa Visão</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ser a primeira escolha e a marca de referência incontornável no mercado para construtoras, gabinetes de arquitetura e clientes exigentes que procuram inovação, elegância e robustez em cada detalhe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares de Excelência */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
            Diferenciais Competitivos
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 font-display mt-1">
            Porquê Escolher a Atlas Materials?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <p.icon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-display">{p.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
