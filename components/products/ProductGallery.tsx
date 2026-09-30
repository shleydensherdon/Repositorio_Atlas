'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: Array<{
    id: string;
    imageUrl: string;
    altText?: string | null;
  }>;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center p-8 border border-slate-200">
        <Image
          src="/logo.png"
          alt={productName}
          width={200}
          height={200}
          className="object-contain opacity-50"
        />
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card group">
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.altText || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Zoom Overlay Action */}
        <button
          type="button"
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white hover:text-brand-900 shadow-md transition-all active:scale-95"
          title="Ampliar fotografia"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Navigation Arrows for Multiple Images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-white transition-all shadow-sm ${
                selectedIndex === idx
                  ? 'border-gold-500 ring-2 ring-gold-200 shadow-md'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} miniatura ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* High-Resolution Zoom Modal */}
      {isZoomModalOpen && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={currentImage.imageUrl}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 text-white text-lg font-bold bg-white/10 hover:bg-white/20 p-3 rounded-full"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
