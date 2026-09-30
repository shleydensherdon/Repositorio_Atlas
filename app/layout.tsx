import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { QuoteProvider } from '@/context/QuoteContext';
import { ConditionalPublicLayout } from '@/components/layout/ConditionalPublicLayout';
import AnalyticsTracker from '@/components/AnalyticsTracker';
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atlas Materials | Fornecimento de Materiais de Construção & Acabamentos de Luxo',
  description: 'Catálogo oficial da Atlas Materials. Loiças sanitárias, porcelanatos, torneiras, portas e materiais de construção de excelência. Peça cotação online e fale diretamente pelo WhatsApp.',
  keywords: 'Atlas Materials, materiais de construção, louça sanitária, porcelanato, tijoleiras, torneiras, portas, Moçambique, Maputo, cotação',
  openGraph: {
    title: 'Atlas Materials | Excelência em Materiais de Construção',
    description: 'Catálogo oficial de acabamentos e louças sanitárias de alta qualidade.',
    url: 'https://atlasmaterials.com',
    siteName: 'Atlas Materials',
    locale: 'pt_MZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${montserrat.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-[#2D2D2D] antialiased font-sans">
        <QuoteProvider>
          <ConditionalPublicLayout>
            <AnalyticsTracker />
            {children}
          </ConditionalPublicLayout>
        </QuoteProvider>
      </body>
    </html>
  );
}
