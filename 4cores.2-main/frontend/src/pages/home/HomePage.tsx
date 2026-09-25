import { useState, useEffect } from "react";
import { AddProductModal } from "@/pages/products/AddProductModal";
import { ArrowRightIcon } from "@/shared/ui/Icons";
import { ProductCard } from "@/shared/ui/ProductCard";

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    // Verifica a permissão do usuário logado no localStorage
    try {
      const savedUser = localStorage.getItem("user") || localStorage.getItem("4cores_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const role = user?.role?.toUpperCase();
        setIsEmployee(role === "EMPLOYEE" || role === "ADMIN" || role === "FUNCIONARIO");
      } else {
        setIsEmployee(false);
      }
    } catch (error) {
      setIsEmployee(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (response.ok) {
        const data = await response.json();
        
        const dbProducts = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description,
          category: item.category || "Suprimentos",
          badge: "Novo",
          image: item.image || "",
          isFeatured: Boolean(item.isFeatured),
        }));

        setProductList(dbProducts);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos do backend:", error);
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

  const featuredProducts = productList.filter((product) => product.isFeatured);

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Tudo para sua impressão</p>
          <h1>
            Sua solução completa
            <br />
            de impressão.
          </h1>
          <p>Suprimentos originais e compatíveis para imprimir suas melhores ideias.</p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a className="button" href="#destaques">
              Comprar agora <ArrowRightIcon size={17} />
            </a>
            {isEmployee && (
              <button
                type="button"
                className="button"
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
                onClick={() => setIsModalOpen(true)}
              >
                + Adicionar Produto
              </button>
            )}
          </div>
        </div>
        <div className="hero-dots">
          <span />
          <span />
          <span />
        </div>
      </section>

      {/* Seção única: Produtos em Destaque */}
      <section id="destaques" className="container section offers">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Escolhas 4cores</p>
            <h2>Produtos em Destaque</h2>
          </div>
        </div>
        <div className="product-grid">
          {featuredProducts.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", color: "#6b7280" }}>
              Nenhum produto em destaque no momento.
            </p>
          ) : (
            featuredProducts.map((product: any) => (
              <div key={product.id} style={{ position: "relative" }}>
                <ProductCard product={product} onUpdate={fetchProducts} />
                {isEmployee && (
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
            ))
          )}
        </div>
      </section>

      {/* Modal de cadastro de produto */}
      {isEmployee && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}