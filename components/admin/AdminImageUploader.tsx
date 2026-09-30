'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  UploadCloud, 
  Trash2, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';

export interface AdminImageItem {
  imageUrl: string;
  isPrimary?: boolean;
  altText?: string;
  orderIndex?: number;
}

interface AdminImageUploaderProps {
  images: AdminImageItem[];
  onChange: (images: AdminImageItem[]) => void;
  maxFiles?: number;
  label?: string;
  helperText?: string;
}

export function AdminImageUploader({
  images,
  onChange,
  maxFiles = 10,
  label = "Galeria de Fotografias",
  helperText = "Carregue a foto principal e fotos adicionais (JPG, PNG ou WebP, máx 8MB por imagem)."
}: AdminImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);

    const files = Array.from(e.target.files);
    if (images.length + files.length > maxFiles) {
      setError(`O limite máximo é de ${maxFiles} imagens.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar imagens.');
      }

      if (data.files && Array.isArray(data.files)) {
        const newImages: AdminImageItem[] = data.files.map((f: { imageUrl: string; originalName?: string }, idx: number) => ({
          imageUrl: f.imageUrl,
          isPrimary: images.length === 0 && idx === 0,
          altText: f.originalName || '',
          orderIndex: images.length + idx,
        }));

        const updated = [...images, ...newImages];
        if (!updated.some(img => img.isPrimary) && updated.length > 0) {
          updated[0].isPrimary = true;
        }
        onChange(updated);
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao processar o upload das imagens.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const wasPrimary = images[index].isPrimary;
    const updated = images.filter((_, i) => i !== index);
    if (wasPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    const reindexed = updated.map((img, idx) => ({ ...img, orderIndex: idx }));
    onChange(reindexed);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((img, idx) => ({ ...img, orderIndex: idx }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="block text-xs font-bold text-slate-200">
            {label}
          </label>
          <p className="text-[11px] text-slate-400">
            {helperText}
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {images.length}/{maxFiles} imagens
        </span>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
          isUploading
            ? 'border-brand-500/50 bg-brand-500/5 cursor-wait'
            : 'border-slate-700 hover:border-brand-500 bg-[#161616] hover:bg-[#1C1C1C]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 py-2">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <span className="text-xs font-semibold text-slate-300">
              A carregar e a otimizar fotografias...
            </span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Clique para selecionar fotos ou arraste para este espaço
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                PNG, JPG ou WebP (máx. 8 MB por ficheiro)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={`${img.imageUrl}-${idx}`}
              className={`relative rounded-xl overflow-hidden border bg-[#1A1A1A] group aspect-square shadow-sm flex flex-col justify-between transition-all ${
                img.isPrimary ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `Foto ${idx + 1}`}
                fill
                className="object-cover"
              />

              {/* Primary Badge */}
              <div className="absolute top-2 left-2 z-10">
                {img.isPrimary ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-brand-500 text-white font-bold text-[10px] shadow-md">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>Principal</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-black/70 hover:bg-brand-500 text-white text-[10px] flex items-center space-x-1 px-1.5 backdrop-blur-sm"
                    title="Definir como foto principal"
                  >
                    <Star className="w-3 h-3" />
                    <span>Tornar Principal</span>
                  </button>
                )}
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 p-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'left');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    title="Mover para a esquerda"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-colors shadow"
                  title="Eliminar fotografia"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'right');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    title="Mover para a direita"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bottom Index */}
              <div className="absolute bottom-1 right-1.5 bg-black/70 text-[9px] font-mono text-slate-300 px-1 rounded backdrop-blur-xs">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
