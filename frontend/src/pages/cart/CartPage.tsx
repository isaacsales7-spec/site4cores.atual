import { Link } from "react-router-dom";
import { useCart } from "@/features/cart/CartContext";
import { formatCurrency } from "@/shared/ui/ProductCard";

export function CartPage() {
  const { lines, total, setQuantity, remove } = useCart();
  return (
    <div className="container page-content">
      <div className="page-title">
        <p className="eyebrow">Sua seleção</p>
        <h1>Carrinho</h1>
      </div>
      {lines.length === 0 ? (
        <div className="empty-state">
          <h2>Seu carrinho está esperando por você.</h2>
          <p>Encontre suprimentos para deixar cada impressão mais nítida.</p>
          <Link className="button" to="/">
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map(({ product, quantity }) => (
              <article className="cart-line" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div>
                  <p className="eyebrow">{product.category}</p>
                  <h2>{product.name}</h2>
                  <strong>{formatCurrency(product.price)}</strong>
                </div>
                <label>
                  Qtd.
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(product.id, Number(event.target.value))}
                  />
                </label>
                <button type="button" onClick={() => remove(product.id)}>
                  Remover
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Resumo do pedido</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div>
              <span>Entrega</span>
              <strong>Grátis</strong>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Link className="button" to="/checkout">
              Ir para checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
