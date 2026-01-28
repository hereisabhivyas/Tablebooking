import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem, OrderSession } from '@/types';

interface CartContextType {
  items: CartItem[];
  session: OrderSession | null;
  addItem: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  setSession: (session: OrderSession | null) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART_ITEMS: 'dineease_cart_items',
  SESSION: 'dineease_session',
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [session, setSessionState] = useState<OrderSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Persist session to localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (error) {
      console.error('Error saving session to localStorage:', error);
    }
  }, [session]);

  const setSession = useCallback((newSession: OrderSession | null) => {
    setSessionState(newSession);
  }, []);

  const addItem = useCallback((item: MenuItem, quantity = 1, notes?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.menuItem.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { menuItem: item, quantity, notes }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const updateNotes = useCallback((itemId: string, notes: string) => {
    setItems(prev =>
      prev.map(i =>
        i.menuItem.id === itemId ? { ...i, notes } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        session,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        setSession,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
