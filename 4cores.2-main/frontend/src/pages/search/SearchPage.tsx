import { type FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "@/features/catalog/catalog";
import { SearchIcon } from "@/shared/ui/Icons";
import { ProductCard } from "@/shared/ui/ProductCard";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const query = params.get("q")?.trim().toLocaleLowerCase() ?? "";
  const results = products.filter((product) =>
    `${product.name} ${product.category}`.toLocaleLowerCase().includes(query),
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setParams(term.trim() ? { q: term.trim() } : {});
  };
  return (
    <div className="container page-content">
      <div className="page-title">
        <p className="eyebrow">Encontre seu suprimento</p>
        <h1>Busca</h1>
      </div>
      <form className="search-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="search">
          Buscar produto
        </label>
        <input
          id="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Busque por produto ou categoria"
        />
        <button type="submit" aria-label="Pesquisar">
          <SearchIcon size={18} />
        </button>
      </form>
      {query ? (
        <>
          <p className="results-label">
            {results.length} resultado(s) para “{params.get("q")}”
          </p>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="empty-state">
              <h2>Nenhum produto encontrado.</h2>
              <p>Tente buscar por impressora, cartucho, toner ou papel.</p>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h2>O que você precisa imprimir hoje?</h2>
          <p>Digite um produto ou categoria para começar.</p>
        </div>
      )}
    </div>
  );
}
