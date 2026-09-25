import { useState, useEffect } from "react";
import { useCart } from "@/features/cart/CartContext";

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product, onUpdate }: { product: any; onUpdate?: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [isFeatured, setIsFeatured] = useState(Boolean(product.isFeatured));
  const [loading, setLoading] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  // Sincroniza o estado local quando os dados do produto mudam
  useEffect(() => {
    setIsFeatured(Boolean(product.isFeatured));
  }, [product.isFeatured]);

  // Verifica o cargo do usuário no localStorage para controle de acesso
  useEffect(() => {
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

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleFeatured = async () => {
    const nextState = !isFeatured;
    setIsFeatured(nextState);

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/products/${product.id}/featured`, {
        method: "PATCH",
      });

      if (response.ok) {
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setIsFeatured(!nextState);
        alert("Erro ao salvar o destaque no servidor. Verifique o backend.");
      }
    } catch (error) {
      console.error("Erro ao alterar destaque:", error);
      setIsFeatured(!nextState);
      alert("Não foi possível conectar ao servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="product-card">
      <div
        className="product-image-wrap"
        style={{
          width: "100%",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#f9fafb",
          position: "relative",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            padding: "8px",
          }}
        />
        <span className="product-badge">{product.badge ?? "Oferta"}</span>
      </div>
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <strong>{formatCurrency(product.price)}</strong>
        <span className="stock">● Em estoque</span>

        {/* Exibe o botão de alternar destaque APENAS para funcionários e administradores */}
        {isEmployee && (
          <button
            type="button"
            className="button button-small"
            disabled={loading}
            style={{
              backgroundColor: isFeatured ? "#eab308" : "transparent",
              color: isFeatured ? "#ffffff" : "#374151",
              borderColor: isFeatured ? "#ca8a04" : "#d1d5db",
              marginBottom: "8px",
              width: "100%",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer",
            }}
            onClick={handleToggleFeatured}
          >
            {isFeatured ? "★ Em destaque" : "☆ Adicionar aos destaques"}
          </button>
        )}

        <button type="button" className="button button-small" onClick={handleAdd}>
          {added ? "Adicionado" : "Adicionar ao carrinho"}
        </button>
      </div>
    </article>
  );
}