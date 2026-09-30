import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | null, currency: string = 'MT'): string {
  if (value === undefined || value === null) return 'Sob Consulta';
  return new Intl.NumberFormat('pt-MZ', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value) + ` ${currency}`;
}

export function formatArea(area: number): string {
  return `${area.toFixed(2).replace('.', ',')} m²`;
}

export function generateQuoteReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ATL-${year}-${randomNum}`;
}
