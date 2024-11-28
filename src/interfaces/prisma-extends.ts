import { Prisma } from "@prisma/client";


export type ProductWithCategory = Prisma.ProductGetPayload<{
    include: { category: true };
  }>;
  

export interface ProductFormProps {
    onSave: (product: ProductWithCategory) => void; // Altere aqui
    editingProduct?: ProductWithCategory | null; // Altere aqui
    onCancel?: () => void;
}
  
export interface ProductListProps {
    products: ProductWithCategory[];
    onEdit: (product: ProductWithCategory) => void;
    onDelete: (id: string) => void;
  }