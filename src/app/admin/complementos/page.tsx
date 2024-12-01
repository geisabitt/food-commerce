"use client";
import { AdditionalGroupWithCategory } from "@/interfaces/prisma-extends";
import { useEffect, useState } from "react";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";

export default function AdditionalPage() {
  const [additionalGroups, setAdditionalGroups] = useState<AdditionalGroupWithCategory[]>([]);
  const [groupName, setGroupName] = useState("");
  const [maxSelect, setMaxSelect] = useState<number>(1);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [additionName, setAdditionName] = useState("");
  const [additionPrice, setAdditionPrice] = useState<number>(0);

  useEffect(() => {
    const fetchAdditionalGroups = async () => {
      try {
        const res = await fetch("/api/additional-groups");
        if (!res.ok) throw new Error("Erro ao carregar os grupos de adicionais.");
        const data = await res.json();
        setAdditionalGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchAdditionalGroups();
  }, []);

  const handleAddGroup = async () => {
    const res = await fetch("/api/additional-groups", {
      method: "POST",
      body: JSON.stringify({ name: groupName, maxSelect }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const newGroup = await res.json();
      setAdditionalGroups([...additionalGroups, { ...newGroup, additional: [] }]);
      setGroupName("");
      setMaxSelect(1);
    } else {
      alert("Erro ao criar grupo de adicionais");
    }
  };

  const handleAddAddition = async () => {
    if (!activeGroupId || !additionName) return;

    const res = await fetch("/api/additional", {
      method: "POST",
      body: JSON.stringify({ name: additionName, price: additionPrice, additionalGroupId: activeGroupId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const newAddition = await res.json();
      setAdditionalGroups((prev) => prev.map((group) => (group.id === activeGroupId ? { ...group, additional: [...group.additional, newAddition] } : group)));
      setAdditionName("");
      setAdditionPrice(0);
    } else {
      alert("Erro ao criar adicional");
    }
  };
  const handleDeleteGroup = async (groupId: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar este grupo de adicionais?");
    if (!confirmed) return;

    const res = await fetch(`/api/additional-groups`, {
      method: "DELETE",
      body: JSON.stringify({ id: groupId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setAdditionalGroups(additionalGroups.filter((group) => group.id !== groupId));
      alert("Grupo deletado com sucesso!");
    } else {
      alert("Erro ao deletar grupo");
    }
  };

  const handleEditGroup = async (groupId: string, newName: string, newMaxSelect: number) => {
    const res = await fetch(`/api/additional-groups`, {
      method: "PUT",
      body: JSON.stringify({
        id: groupId,
        name: newName,
        maxSelect: newMaxSelect,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const updatedGroup = await res.json();
      setAdditionalGroups(additionalGroups.map((group) => (group.id === groupId ? updatedGroup : group)));
      alert("Grupo atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar grupo");
    }
  };

  const handleDeleteAddition = async (additionId: string, groupId: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar este adicional?");
    if (!confirmed) return;

    const res = await fetch(`/api/additional`, {
      method: "DELETE",
      body: JSON.stringify({ id: additionId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setAdditionalGroups((prev) =>
        prev.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              additional: group.additional.filter((add) => add.id !== additionId),
            };
          }
          return group;
        })
      );
      alert("Adicional deletado com sucesso!");
    } else {
      alert("Erro ao deletar adicional");
    }
  };

  const handleEditAddition = async (additionId: string, groupId: string, newName: string, newPrice: number) => {
    const res = await fetch(`/api/additional`, {
      method: "PUT",
      body: JSON.stringify({
        id: additionId,
        name: newName,
        price: newPrice,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const updatedAddition = await res.json();
      setAdditionalGroups((prev) =>
        prev.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              additional: group.additional.map((add) => (add.id === additionId ? updatedAddition : add)),
            };
          }
          return group;
        })
      );
      alert("Adicional atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar adicional");
    }
  };
  const handleToggleActive = async (additionId: string, groupId: string, currentStatus: boolean) => {
    const res = await fetch(`/api/additional`, {
      method: "PUT",
      body: JSON.stringify({
        id: additionId,
        isActive: !currentStatus,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const updatedAddition = await res.json();
      setAdditionalGroups((prev) =>
        prev.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              additional: group.additional.map((add) => (add.id === additionId ? updatedAddition : add)),
            };
          }
          return group;
        })
      );
      alert(`Adicional ${!currentStatus ? "ativado" : "desativado"} com sucesso!`);
    } else {
      alert("Erro ao alterar status do adicional");
    }
  };

  return (
    <div className="mx-auto my-0 p-6 max-w-[70%]">
      <h1>Gerenciamento de Adicionais</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="block text-sm font-bold text-gray-700 mb-1">Criar Grupo de Adicionais</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo de Complementos:</label>
        <input className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Nome do Grupo" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Complementos:</label>
        <input className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="Máximo de Seleções" value={maxSelect} onChange={(e) => setMaxSelect(Number(e.target.value))} />
        <button className="bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-600" onClick={handleAddGroup}>
          Criar Grupo
        </button>
      </div>

      <div>
        <h2>Grupos de Adicionais</h2>
        {additionalGroups.map((group) => (
          <div className="flex flex-row justify-between" key={group.id}>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 w-[48%]">
              <h3 className="text-lg font-semibold text-primary pb-4">
                {group.name} (Máximo: {group.maxSelect})
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm ml-2" onClick={() => handleEditGroup(group.id, group.name, group.maxSelect)}>
                  <BsPencilSquare />
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm ml-2" onClick={() => handleDeleteGroup(group.id)}>
                  <BsTrash3 />
                </button>
              </h3>
              <ul className="flex flex-col gap-2">
                {group.additional.map((addition) => (
                  <li className="flex justify-between" key={addition.id}>
                    <p className="text-sm text-accent w-[50%]">
                      {addition.name} - {addition.price <= 0 ? "" : `R$ ${addition.price.toFixed(2)}`} {addition.isActive ? "(Ativo)" : "(Inativo)"}
                    </p>
                    <div>
                      <button className={`${addition.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white px-2 py-1 rounded text-sm ml-2`} onClick={() => handleToggleActive(addition.id, group.id, addition.isActive)}>
                        {addition.isActive ? "Desativar" : "Ativar"}
                      </button>
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm ml-2" onClick={() => handleEditAddition(addition.id, group.id, addition.name, addition.price)}>
                        <BsPencilSquare />
                      </button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm ml-2" onClick={() => handleDeleteAddition(addition.id, group.id)}>
                        <BsTrash3 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 w-[48%]">
              <h4 className="block text-sm font-bold text-gray-700 mb-1">Adicionar Adicional</h4>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adicional:</label>
              <input className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Nome do Adicional" value={additionName} onChange={(e) => setAdditionName(e.target.value)} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor:</label>
              <input className="block w-full text-gray-700 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="Preço do Adicional" value={additionPrice} onChange={(e) => setAdditionPrice(Number(e.target.value))} />
              <button
                className="bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  setActiveGroupId(group.id);
                  handleAddAddition();
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
