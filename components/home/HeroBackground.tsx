'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const heroImages = [
  {
    src: '/fundo/construction-site-silhouettes.jpg',
    alt: 'Obra de construção com soluções Atlas Materials',
  },
  {
    src: '/fundo/cropped-shot-dark-skinned-contractor-holding-touch-pad-entering-data-while-working-new-housing-project-sitting-desk-with-drawings-scale-model-house-blueprint-rolls-ruler-helmets.jpg',
    alt: 'Profissional a planear um projeto de construção',
  },
  {
    src: '/fundo/working-housing-project.jpg',
    alt: 'Projeto residencial em execução',
  },
];

export function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {heroImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover scale-105 blur-[2px] transition-opacity duration-[1800ms] ease-in-out ${
            activeIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/40" />
    </div>
  );
}
