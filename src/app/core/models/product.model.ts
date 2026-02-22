export type ProductUnit = 'piece' | 'board' | 'kg' | 'liter' | 'meter' | 'box' | 'sheet';

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  sku: string;
  unit: ProductUnit;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  location: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
