import type { Product } from "@/shared/types/catalog";

export const products: Product[] = [
  {
    id: "printer",
    name: "Impressora Inkjet / Laser",
    category: "Impressoras",
    price: 699.9,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=700&q=85",
    badge: "Mais vendido",
  },
  {
    id: "ink",
    name: "Cartucho de Tinta Colorido",
    category: "Cartuchos",
    price: 149.9,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1563212034-a3c52112c6a5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "toner",
    name: "Toner Compatível Premium",
    category: "Toners",
    price: 179,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1632053001725-4a0b9f8c9f3c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "paper",
    name: "Papéis Especiais A4",
    category: "Papéis",
    price: 39.9,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=85",
  },
];

export const categories = [
  { name: "Impressoras Inkjet / Laser", icon: "🖨", image: products[0].image },
  { name: "Cartuchos de Tinta", icon: "▣", image: products[1].image },
  { name: "Toners", icon: "▤", image: products[2].image },
  { name: "Papéis Especiais", icon: "▧", image: products[3].image },
];
