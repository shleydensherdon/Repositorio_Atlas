'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, FileImage, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface UploadedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

interface PhotoUploadProps {
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
}

export function PhotoUpload({
  onPhotosChange,
  maxFiles = 5,
  maxSizeMb = 10,
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);

    const newFiles = Array.from(e.target.files);
    const validPhotos: UploadedPhoto[] = [];

    if (photos.length + newFiles.length > maxFiles) {
      setError(`Limite máximo de ${maxFiles} fotografias por pedido atingido.`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError(`O ficheiro ${file.name} não é suportado. Utilize apenas JPG, JPEG, PNG ou WEBP.`);
        continue;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`O ficheiro ${file.name} excede o limite máximo de ${maxSizeMb}MB.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validPhotos.push({
        id: `${file.name}_${Date.now()}_${Math.random()}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
      });
    }

    const updated = [...photos, ...validPhotos];
    setPhotos(updated);
    onPhotosChange(updated);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (id: string) => {
    const photoToRemove = photos.find((p) => p.id === id);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.previewUrl);
    }
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-slate-900">
            Fotografias do Espaço / Planta do Projeto (Opcional)
          </label>
          <p className="text-xs text-slate-500">
            Anexe imagens da obra, plantas ou referências visuais para um orçamento mais preciso.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {photos.length} de {maxFiles} fotos
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center text-brand-700 transition-colors">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-slate-800">
            Clique para carregar ou arraste as fotografias
          </div>
          <p className="text-xs text-slate-400">
            Formatos suportados: JPG, PNG, WEBP (máximo {maxSizeMb}MB por imagem)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group aspect-square shadow-sm"
            >
              <Image
                src={photo.previewUrl}
                alt={photo.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                  title="Remover fotografia"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-slate-200 px-1.5 py-0.5 truncate">
                {photo.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
