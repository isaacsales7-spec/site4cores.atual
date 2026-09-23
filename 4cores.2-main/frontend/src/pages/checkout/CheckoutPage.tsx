import { Link } from "react-router-dom";
import { useCart } from "@/features/cart/CartContext";
import { formatCurrency } from "@/shared/ui/ProductCard";

export function CheckoutPage() {
  const { lines, total } = useCart();
  return (
    <div className="container page-content">
      <div className="page-title">
        <p className="eyebrow">Quase lá</p>
        <h1>Finalizar pedido</h1>
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
          <form className="checkout-form" onSubmit={(event) => event.preventDefault()}>
            <fieldset>
              <legend>Seus dados</legend>
              <div className="form-grid">
                <label>
                  Nome completo
                  <input required />
                </label>
                <label>
                  E-mail
                  <input type="email" required />
                </label>
                <label>
                  Telefone
                  <input required />
                </label>
                <label>
                  CPF
                  <input required />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Endereço de entrega</legend>
              <div className="form-grid">
                <label>
                  CEP
                  <input required />
                </label>
                <label>
                  Endereço
                  <input required />
                </label>
                <label>
                  Número
                  <input required />
                </label>
                <label>
                  Complemento
                  <input />
                </label>
                <label>
                  Cidade
                  <input required />
                </label>
                <label>
                  Estado
                  <select defaultValue="SP">
                    <option>SP</option>
                    <option>RJ</option>
                    <option>MG</option>
                  </select>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Forma de pagamento</legend>
              <label className="radio-line">
                <input type="radio" name="payment" defaultChecked /> Cartão de crédito
              </label>
              <label className="radio-line">
                <input type="radio" name="payment" /> Pix
              </label>
            </fieldset>
            <button type="submit" className="button">
              Finalizar pedido
            </button>
          </form>
          <aside className="summary">
            <h2>Resumo da compra</h2>
            {lines.map(({ product, quantity }) => (
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
            <small>Pagamento seguro. Nenhum pagamento real será processado nesta versão.</small>
          </aside>
        </div>
      )}
    </div>
  );
}
