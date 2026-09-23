import { useEffect, useState } from 'react';
import { AddProductModal } from './AddProductModal';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
}

export function EmployeeProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Deseja realmente apagar este produto?')) return;

    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } else {
        alert('Erro ao apagar produto.');
      }
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gerenciamento de Produtos</h2>
          <p className="text-sm text-gray-500">Cadastre ou remova itens do catálogo.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Produtos Cadastrados</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum produto cadastrado.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm font-semibold text-gray-600 bg-gray-50">
                <th className="p-3">Nome</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Estoque</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{product.name}</td>
                  <td className="p-3 text-gray-600">R$ {product.price.toFixed(2)}</td>
                  <td className="p-3 text-gray-600">{product.stock}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para cadastrar novos produtos */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
}