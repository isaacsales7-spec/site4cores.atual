import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/features/cart/CartContext";
import { formatCurrency } from "@/shared/ui/ProductCard";
import { supabase } from "@/shared/lib/supabase";

export function CheckoutPage() {
  const { lines, total, clear } = useCart() as any;

  // Estados dos dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");

  const [paymentMethod, setPaymentMethod] = useState("Cartão de crédito");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatações
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 0) {
      if (digits.length <= 2) formatted = `(${digits}`;
      else if (digits.length <= 6) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      else if (digits.length <= 10) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      else formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setPhone(formatted);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 0) {
      if (digits.length <= 3) formatted = digits;
      else if (digits.length <= 6) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      else if (digits.length <= 9) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      else formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }
    setCpf(formatted);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    setCep(formatted);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const orderId = `#${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Procura o ID do utilizador se estiver autenticado no Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      // 1. Salva o pedido principal na tabela 'orders'
      const { error: orderError } = await supabase.from("orders").insert([
        {
          id: orderId,
          user_id: userId,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          customer_cpf: cpf,
          shipping_address: { cep, address, number, complement, city, state },
          payment_method: paymentMethod,
          total_amount: total,
          status: "PENDING",
        },
      ]);

      if (orderError) throw orderError;

      // 2. Salva os itens associados na tabela 'order_items'
      const orderItems = lines.map((line: any) => ({
        order_id: orderId,
        product_id: String(line.product.id),
        product_name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Limpa o carrinho e exibe a tela de sucesso
      if (typeof clear === "function") {
        clear();
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Erro ao salvar pedido no Supabase:", error);
      alert(`Houve um erro ao processar o seu pedido: ${error.message || "Tente novamente."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container page-content" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ color: "#16a34a", marginBottom: "12px" }}>Pedido Finalizado com Sucesso!</h1>
        <p style={{ color: "#4b5563", fontSize: "1.1rem", marginBottom: "32px" }}>
          Obrigado pela sua compra. Seu pedido foi recebido e já está em processamento.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link className="button" to="/">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <style>{`
        .checkout-form label {
          color: #111827 !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .checkout-form legend {
          color: #0f172a !important;
          font-weight: 700 !important;
          font-size: 1.2rem !important;
          margin-bottom: 12px !important;
        }

        .checkout-form input,
        .checkout-form select {
          border: 1px solid #9ca3af !important;
          border-radius: 6px !important;
          padding: 10px 12px !important;
          font-size: 0.95rem !important;
          color: #111827 !important;
          background-color: #ffffff !important;
        }

        .checkout-form input:focus,
        .checkout-form select:focus {
          outline: none !important;
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }

        .checkout-form .radio-line {
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
          cursor: pointer !important;
          margin-bottom: 8px !important;
        }

        .checkout-form .radio-line input {
          width: 18px !important;
          height: 18px !important;
          cursor: pointer !important;
        }
      `}</style>

      <div className="page-title">
        <div>
          <p className="eyebrow">Quase lá</p>
          <h1>Finalizar pedido</h1>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="empty-state">
          <h2>Adicione produtos antes de finalizar.</h2>
          <Link className="button" to="/">
            Voltar para a loja
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Seus dados</legend>
              <div className="form-grid">
                <label>
                  Nome completo
                  <input required placeholder="Digite seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                  E-mail
                  <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  Telefone
                  <input type="tel" required placeholder="(00) 00000-0000" value={phone} onChange={handlePhoneChange} maxLength={15} />
                </label>
                <label>
                  CPF
                  <input type="text" required placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} maxLength={14} />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Endereço de entrega</legend>
              <div className="form-grid">
                <label>
                  CEP
                  <input type="text" required placeholder="00000-000" value={cep} onChange={handleCepChange} maxLength={9} />
                </label>
                <label>
                  Endereço
                  <input required placeholder="Rua, Avenida, etc." value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
                <label>
                  Número
                  <input required placeholder="123" value={number} onChange={(e) => setNumber(e.target.value)} />
                </label>
                <label>
                  Complemento
                  <input placeholder="Apto, Bloco, etc." value={complement} onChange={(e) => setComplement(e.target.value)} />
                </label>
                <label>
                  Cidade
                  <input required placeholder="Sua cidade" value={city} onChange={(e) => setCity(e.target.value)} />
                </label>
                <label>
                  Estado
                  <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="CE">CE</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Forma de pagamento</legend>
              <label className="radio-line">
                <input type="radio" name="payment" value="Cartão de crédito" checked={paymentMethod === "Cartão de crédito"} onChange={(e) => setPaymentMethod(e.target.value)} /> Cartão de crédito
              </label>
              <label className="radio-line">
                <input type="radio" name="payment" value="Pix" checked={paymentMethod === "Pix"} onChange={(e) => setPaymentMethod(e.target.value)} /> Pix
              </label>
              <label className="radio-line">
                <input type="radio" name="payment" value="Boleto bancário" checked={paymentMethod === "Boleto bancário"} onChange={(e) => setPaymentMethod(e.target.value)} /> Boleto bancário
              </label>
            </fieldset>

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Processando..." : "Finalizar pedido"}
            </button>
          </form>

          <aside className="summary">
            <h2>Resumo da compra</h2>
            {lines.map(({ product, quantity }: any) => (
              <div className="mini-line" key={product.id}>
                <span>
                  {quantity}x {product.name}
                </span>
                <strong>{formatCurrency(product.price * quantity)}</strong>
              </div>
            ))}
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}