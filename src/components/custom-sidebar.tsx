"use client";
import { useState } from "react";
import Link from "next/link";
import { TbMenu2, TbBrandProducthunt } from "react-icons/tb";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { RiDrinks2Line } from "react-icons/ri";

export default function CustomSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const links = [
    { href: "/", label: "Açaí", icon: <RiDrinks2Line className="w-6 h-6" /> },
    { href: "/admin/produtos", label: "Produtos", icon: <TbBrandProducthunt className="w-6 h-6" /> },
    { href: "/admin/categorias", label: "Catecorias", icon: <AiFillProduct className="w-6 h-6" /> },
    { href: "/admin/complementos", label: "Complementos", icon: <AiOutlineProduct className="w-6 h-6" /> },
  ];

  return (
    <aside className={`flex fixed lg:flex-col items-center bg-red-600 transition-all duration-300 ${menuOpen ? "lg:max-w-64 lg:w-64" : "lg:max-w-20 lg:w-20"} p-4 lg:left-0 lg:top-0 lg:h-full bottom-0 w-full`}>
      {/* Botão de menu */}
      <button type="button" onClick={handleToggleMenu} className="lg:mb-4 text-yellow-600 hiddem focus:outline-none">
        <TbMenu2 className="w-6 h-6" />
      </button>

      {/* Navegação */}
      <nav className="flex w-full">
        <ul className="flex items-center gap-6 lg:flex-col">
          {links.map((link) => (
            <li key={link.href} className="w-full">
              <Link href={link.href} className={`flex items-center gap-4 px-3 py-2 w-full text-yellow-500`}>
                <span className="">{link.icon}</span>
                {menuOpen && <span className="text-lg font-medium">{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
