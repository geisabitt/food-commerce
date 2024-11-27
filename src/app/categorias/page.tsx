"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categorias</h1>
      <ul>
        {categories.map((category: { id: string; name: string; description: string }) => (
          <li key={category.id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
