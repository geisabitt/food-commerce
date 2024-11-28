"use client";
import { useState, useEffect } from "react";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import { ProductWithCategory } from "@/interfaces/prisma-extends";

export default function Page() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data: ProductWithCategory[] = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleSave = (product: ProductWithCategory) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts((prev) => [...prev, product]);
    }
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administração de Produtos</h1>
      <ProductForm onSave={handleSave} editingProduct={editingProduct} onCancel={() => setEditingProduct(null)} />
      <ProductList products={products} onEdit={setEditingProduct} onDelete={handleDelete} />
    </div>
  );
}
