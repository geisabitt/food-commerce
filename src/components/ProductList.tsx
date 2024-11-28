"use client";

import { useEffect, useState } from "react";
import { ProductListProps, ProductWithCategory } from "@/interfaces/prisma-extends";

export default function ProductList({ products, onEdit }: ProductListProps) {
  const [allProducts, setProducts] = useState<ProductWithCategory[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar este produto?");
    if (!confirmed) return;

    const res = await fetch(`/api/products`, { method: "DELETE", body: JSON.stringify({ id }) });

    if (res.ok) {
      setProducts(products.filter((product) => product.id !== id));
      alert("Produto deletado com sucesso!");
    } else {
      alert("Erro ao deletar o produto");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <ul className="space-y-4">
        {allProducts.map((product) => (
          <li key={product.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-primary">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.description || "Sem descrição"}</p>
              <p className="text-sm text-accent">Categoria: {product.category.name || "N/A"}</p>
              <p className="text-sm text-gray-600">Preço: R$ {Number(product.price).toFixed(2)}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => onEdit(product)}>
                Editar
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(product.id)}>
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
