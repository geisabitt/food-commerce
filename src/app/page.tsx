//import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <h1>Inicio</h1>
        <Link href={"/admin/produtos"}>Adm produtos</Link>
        <Link href={"/admin/categorias"}>Adm categorias</Link>
        <Link href={"/admin/complementos"}>Adm complementos</Link>
      </main>
    </div>
  );
}
