"use client";
import { useEffect, useState } from "react";
import { Product, Category } from "@prisma/client";
import Decimal from "decimal.js";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<Decimal | "">("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch("/api/products");
        const categoryRes = await fetch("/api/categories");

        if (!productRes.ok || !categoryRes.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const productsData = await productRes.json();
        const categoriesData = await categoryRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar este produto?");
    if (!confirmed) return;

    const res = await fetch(`/api/products`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setProducts(products.filter((product) => product.id !== id));
      alert("Produto deletado com sucesso!");
    } else {
      alert("Erro ao deletar o produto");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setCategoryId(product.categoryId || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      price,
      description,
      categoryId,
    };

    if (editingProductId) {
      const res = await fetch(`/api/products`, {
        method: "PUT",
        body: JSON.stringify({ ...payload, id: editingProductId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Produto atualizado com sucesso!");
        setProducts((prev) => prev.map((product) => (product.id === editingProductId ? { ...product, name, price: new Decimal(price || 0), description, categoryId } : product)));
        setEditingProductId(null);
      } else {
        alert("Erro ao atualizar o produto");
      }
    } else {
      const res = await fetch(`/api/products`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Produto criado com sucesso!");
        setProducts([...products, await res.json()]);
      } else {
        alert("Erro ao criar produto");
      }
    }

    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
  };

  return (
    <div className="mx-auto my-0 p-6 max-w-96">
      <h1 className="text-2xl font-bold mb-4">Administração de Produtos</h1>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço:</label>
          <input type="number" value={price?.toString() || "0"} onChange={(e) => setPrice(e.target.value !== "" ? new Decimal(e.target.value) : "")} required className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria:</label>
          <select value={categoryId || ""} onChange={(e) => setCategoryId(e.target.value)} className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingProductId ? "Atualizar Produto" : "Criar Produto"}
        </button>
        {editingProductId && (
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              setEditingProductId(null);
              setName("");
              setPrice("");
              setDescription("");
              setCategoryId("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-primary">{product.name}</h2>
              <p className="text-sm text-accent">Preço: R$ {product.price instanceof Decimal ? product.price.toNumber().toFixed(2) : Number(product.price).toFixed(2)}</p>
              <p className="text-sm text-accent">{product.description || "Sem descrição"}</p>
              <p className="text-sm text-accent">Categoria: {categories.find((cat) => cat.id === product.categoryId)?.name || "Sem categoria"}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => handleEdit(product)}>
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
