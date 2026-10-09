import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/features/cart/CartContext";
import { products } from "@/features/catalog/catalog";

describe("carrinho local", () => {
  it("adiciona, soma e remove produtos", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.add(products[0]));
    act(() => result.current.add(products[0]));
    expect(result.current.count).toBe(2);
    expect(result.current.total).toBeCloseTo(products[0].price * 2);
    act(() => result.current.remove(products[0].id));
    expect(result.current.lines).toHaveLength(0);
  });
});
