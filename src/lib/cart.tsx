import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItemInput } from "./validation";

const STORAGE_KEY = "fp_cart_v1";

export type CartItem = CartItemInput;

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "id">) => string;
  updateItem: (id: string, patch: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotalCents: number;
  shippingTotalCents: number;
  totalCents: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* повредени данни в количката се игнорират */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents, 0);
    const shippingTotalCents = items.reduce((sum, i) => sum + i.shippingCents, 0);
    return {
      items,
      hydrated,
      addItem: (item) => {
        const id = newId();
        setItems((prev) => [...prev, { ...item, id } as CartItem]);
        return id;
      },
      updateItem: (id, patch) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))),
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
      subtotalCents,
      shippingTotalCents,
      totalCents: subtotalCents + shippingTotalCents,
      count: items.length,
    };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart трябва да се използва в CartProvider.");
  return ctx;
}
