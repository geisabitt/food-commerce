"use client";
import { ProductFormProps } from "@/interfaces/prisma-extends";
import { Category, Product } from "@prisma/client";
import Decimal from "decimal.js";
import { useState, useEffect } from "react";

export default function ProductForm({ onSave, editingProduct, onCancel }: ProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    price: new Decimal(0),
    description: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    } else {
      setProduct({ name: "", price: new Decimal(0), description: "", categoryId: "" });
    }
  }, [editingProduct]);

  const handleChange = (key: keyof Product, value: string | Decimal) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";

    const res = await fetch(url, {
      method,
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const savedProduct = await res.json();
      onSave(savedProduct);
      alert(editingProduct ? "Produto editado com sucesso!" : "Produto criado com sucesso!");
      setProduct({ name: "", price: new Decimal(0), description: "", categoryId: "" });
    } else {
      alert("Erro ao salvar o produto");
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input type="text" value={product.name || ""} onChange={(e) => handleChange("name", e.target.value)} className="w-full p-2 border rounded text-gray-700" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
          <input type="number" value={product.price?.toString() || "0"} onChange={(e) => handleChange("price", new Decimal(e.target.value))} className="w-full p-2 border rounded text-gray-700" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea value={product.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="w-full p-2 border rounded text-gray-700"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select value={product.categoryId || ""} onChange={(e) => handleChange("categoryId", e.target.value)} className="w-full p-2 border rounded text-gray-700" required>
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Salvar
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
