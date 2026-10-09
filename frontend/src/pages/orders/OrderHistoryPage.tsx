import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/shared/ui/ProductCard";
import { supabase } from "@/shared/lib/supabase";

interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  address: {
    cep: string;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
  };
  paymentMethod: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
}

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Procura os pedidos e os respetivos itens no Supabase
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar histórico do Supabase:", error);
      } else if (data) {
        // Mapeia os dados do Supabase para a estrutura da interface
        const formattedOrders: Order[] = data.map((item) => ({
          id: item.id,
          createdAt: item.created_at,
          customer: {
            name: item.customer_name || "Cliente sem nome",
            email: item.customer_email || "-",
            phone: item.customer_phone || "-",
            cpf: item.customer_cpf || "-",
          },
          address: item.shipping_address || {},
          paymentMethod: item.payment_method || "Não informado",
          items: (item.order_items || []).map((line: any) => ({
            product: {
              id: line.product_id,
              name: line.product_name,
              price: Number(line.price),
            },
            quantity: line.quantity,
          })),
          total: Number(item.total_amount ?? item.total ?? 0),
        }));

        setOrders(formattedOrders);
      }
    } catch (e) {
      console.error("Erro inesperado:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (confirm("Deseja realmente apagar todo o histórico de compras da base de dados?")) {
      try {
        const { error } = await supabase.from("orders").delete().neq("id", "");
        if (error) throw error;
        setOrders([]);
      } catch (error) {
        console.error("Erro ao apagar histórico:", error);
        alert("Não foi possível apagar o histórico na base de dados.");
      }
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  return (
    <div className="container page-content" style={{ paddingBottom: "60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <p className="eyebrow">Painel do Funcionário</p>
          <h1>Histórico de Compras</h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {orders.length > 0 && (
            <button onClick={clearHistory} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
              Limpar Histórico
            </button>
          )}
          <Link className="button" to="/checkout">
            Voltar ao Checkout
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="empty-state" style={{ textAlign: "center", padding: "40px" }}>
          <h2>A carregar pedidos da nuvem...</h2>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Nenhum pedido foi realizado ainda.</h2>
          <p style={{ color: "#6b7280" }}>Os novos pedidos aparecerão aqui assim que forem finalizados pelos clientes.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {/* Cabeçalho do Pedido */}
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
                <div>
                  <strong style={{ fontSize: "1.2rem", color: "#0f172a" }}>Pedido {order.id}</strong>
                  <span style={{ marginLeft: "12px", color: "#2563eb", fontWeight: 600 }}>
                    {order.paymentMethod}
                  </span>
                </div>
                <div style={{ color: "#64748b", fontWeight: 500 }}>
                  📅 <strong>Data/Hora:</strong> {formatDate(order.createdAt)}
                </div>
              </div>

              {/* Informações do Cliente e Endereço */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#334155" }}>👤 Dados do Cliente</h4>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}><strong>Nome:</strong> {order.customer.name}</p>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}><strong>E-mail:</strong> {order.customer.email}</p>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}><strong>Telefone:</strong> {order.customer.phone}</p>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}><strong>CPF:</strong> {order.customer.cpf}</p>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#334155" }}>📍 Endereço de Entrega</h4>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}>
                    {order.address.address}, Nº {order.address.number} {order.address.complement && `(${order.address.complement})`}
                  </p>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}>
                    {order.address.city} - {order.address.state}
                  </p>
                  <p style={{ margin: "4px 0", color: "#1e293b" }}><strong>CEP:</strong> {order.address.cep}</p>
                </div>
              </div>

              {/* Itens Comprados */}
              <div>
                <h4 style={{ margin: "0 0 8px 0", color: "#334155" }}>📦 Itens do Pedido</h4>
                <div style={{ border: "1px solid #f1f5f9", borderRadius: "6px", overflow: "hidden" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <span>
                        <strong>{item.quantity}x</strong> {item.product.name}
                      </span>
                      <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total do Pedido */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                  Total do Pedido: <strong style={{ fontSize: "1.3rem", color: "#16a34a" }}>{formatCurrency(order.total)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}