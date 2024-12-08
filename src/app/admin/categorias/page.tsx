"use client";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar esta categoria?");
    if (!confirmed) return;

    const res = await fetch(`/api/categories`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCategories(categories.filter((category) => category.id !== id));
      alert("Categoria deletada com sucesso!");
    } else {
      alert("Erro ao deletar a categoria");
    }
  };

  const handleEdit = (id: string, name: string, description: string) => {
    setEditingCategoryId(id);
    setName(name);
    setDescription(description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategoryId) {
      const res = await fetch("/api/categories", {
        method: "PUT",
        body: JSON.stringify({ id: editingCategoryId, name, description }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Categoria atualizada com sucesso!");
        setCategories((prev) => prev.map((category) => (category.id === editingCategoryId ? { ...category, name, description } : category)));
        setEditingCategoryId(null);
      } else {
        alert("Erro ao atualizar a categoria");
      }
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Categoria criada com sucesso!");
        setCategories([...categories, await res.json()]);
      } else {
        alert("Erro ao criar categoria");
      }
    }

    setName("");
    setDescription("");
  };

  return (
    <div className="mx-auto my-0 p-6 max-w-96">
      <h1 className="text-2xl font-bold mb-4">Administração de Categorias</h1>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full  text-gray-700  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full  text-gray-700  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingCategoryId ? "Atualizar Categoria" : "Criar Categoria"}
        </button>
        {editingCategoryId && (
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              setEditingCategoryId(null);
              setName("");
              setDescription("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <ul className="space-y-4">
        {categories &&
          categories.map((category) => (
            <li key={category.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-primary">{category.name}</h2>
                <p className="text-sm text-gray-700">{category.description || "Sem descrição"}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => handleEdit(category.id, category.name, category.description || "")}>
                  Editar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(category.id)}>
                  Deletar
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
