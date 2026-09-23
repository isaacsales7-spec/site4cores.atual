import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/shared/ui/ProductCard";

export function CatalogPage({ title, category }: { title: string; category?: string }) {
  const [productList, setProductList] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      let dbProductsFormatted: any[] = [];

      if (response.ok) {
        const data = await response.json();
        dbProductsFormatted = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description,
          category: item.category || "Suprimentos",
          badge: "Novo",
          image: item.image || "",
          isFeatured: Boolean(item.isFeatured),
          isFromDb: true,
        }));
      }

      setProductList(dbProductsFormatted);
    } catch (error) {
      console.error("Erro ao buscar produtos do backend:", error);
      setProductList([]);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      } else {
        alert("Erro ao excluir o produto do banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const visibleProducts = category
    ? productList.filter((product) => {
        const targetCategory = category.toLowerCase().trim();
        const prodCategory = (product.category || "").toLowerCase().trim();

        return prodCategory === targetCategory;
      })
    : productList;

  return (
    <div className="container page-content">
      <div className="page-title">
        <p className="eyebrow">Linha 4cores</p>
        <h1>{title}</h1>
        <p className="page-lead">
          Produtos selecionados para uma impressão mais simples, econômica e confiável.
        </p>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <div key={product.id} style={{ position: "relative" }}>
            <ProductCard product={product} onUpdate={fetchProducts} />
            {product.isFromDb && (
              <button
                type="button"
                onClick={() => handleDeleteProduct(product.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                Excluir
              </button>
            )}
          </div>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="empty-state">
          <h2>Estamos preparando esta seleção.</h2>
          <Link className="button" to="/">
            Voltar para a Home
          </Link>
        </div>
      )}
    </div>
  );
}