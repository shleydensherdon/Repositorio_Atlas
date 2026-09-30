'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteCartItem {
  id: string; // unique item id in cart (can be productId or generated if custom calc)
  productId: string;
  productName: string;
  sku?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  unit: string;
  quantity: number;
  isPerSquareMeter?: boolean;
  length?: number;
  width?: number;
  wastePercentage?: number;
  calculatedArea?: number;
  subtotal?: number;
}

export interface CustomerInfo {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  projectType: string;
  location: string;
  notes: string;
}

interface QuoteContextType {
  items: QuoteCartItem[];
  customer: CustomerInfo;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  addItem: (item: Omit<QuoteCartItem, 'id' | 'subtotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateTileCalculation: (id: string, length: number, width: number, wastePercentage: number) => void;
  clearQuote: () => void;
  totalItemsCount: number;
  estimatedTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const STORAGE_KEY = 'atlas_materials_quote_cart_v1';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    projectType: 'Residencial',
    location: '',
    notes: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Erro ao carregar cesto de cotação:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Erro ao guardar cesto de cotação:', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<QuoteCartItem, 'id' | 'subtotal'>) => {
    setItems((prev) => {
      // Verificar se já existe o mesmo produto sem cálculo customizado
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && !item.isPerSquareMeter
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + item.quantity;
        const subtotal = current.price ? current.price * newQty : 0;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          subtotal,
        };
        return updated;
      }

      // Novo item
      const id = `${item.productId}_${Date.now()}`;
      const subtotal = item.price ? item.price * item.quantity : 0;
      return [...prev, { ...item, id, subtotal }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const subtotal = item.price ? item.price * quantity : 0;
          return { ...item, quantity, subtotal };
        }
        return item;
      })
    );
  };

  const updateTileCalculation = (
    id: string,
    length: number,
    width: number,
    wastePercentage: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const rawArea = Math.max(0, length) * Math.max(0, width);
          const calculatedArea = Number((rawArea * (1 + wastePercentage / 100)).toFixed(2));
          const quantity = calculatedArea;
          const subtotal = item.price ? Number((item.price * quantity).toFixed(2)) : 0;
          return {
            ...item,
            length,
            width,
            wastePercentage,
            calculatedArea,
            quantity,
            subtotal,
          };
        }
        return item;
      })
    );
  };

  const clearQuote = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const totalItemsCount = items.reduce((acc, item) => acc + (item.quantity > 0 ? 1 : 0), 0);
  const estimatedTotal = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        customer,
        setCustomer,
        addItem,
        removeItem,
        updateQuantity,
        updateTileCalculation,
        clearQuote,
        totalItemsCount,
        estimatedTotal,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote deve ser utilizado dentro de um QuoteProvider');
  }
  return context;
}
