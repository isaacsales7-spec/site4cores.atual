import { createContext, type ReactNode, useContext, useState } from "react";
import type { Product } from "@/shared/types/catalog";

type CartLine = { product: Product; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const add = (product: Product) =>
    setLines((current) => {
      const line = current.find((item) => item.product.id === product.id);
      return line
        ? current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { product, quantity: 1 }];
    });
  const remove = (id: string) =>
    setLines((current) => current.filter((line) => line.product.id !== id));
  const setQuantity = (id: string, quantity: number) =>
    quantity < 1
      ? remove(id)
      : setLines((current) =>
          current.map((line) => (line.product.id === id ? { ...line, quantity } : line)),
        );
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <CartContext.Provider value={{ lines, count, total, add, remove, setQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
