import { type FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "@/shared/ui/Icons";
import { ProductCard } from "@/shared/ui/ProductCard";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const query = params.get("q")?.trim().toLocaleLowerCase() ?? "";
  
  const results = products.filter((product) =>
    `${product.name} ${product.category} ${product.description ?? ""}`
      .toLocaleLowerCase()
      .includes(query),
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

      {loading ? (
        <div className="empty-state">
          <p>Buscando produtos...</p>
        </div>
      ) : query ? (
        <>
          <p className="results-label">
            {results.length} resultado(s) para “{params.get("q")}”
          </p>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} onUpdate={fetchProducts} />
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