export interface Batch {
  id: string;
  batchNumber: string;
  expiryDate: string;
  stock: number;
  mrp: number;
  manufacturingDate: string;
  purchasePrice?: number;
  sellingPrice?: number;
}

export interface Medicine {
  id: string;
  name: string;
  type: string;
  hsn: string;
  category: 'Generic' | 'Branded';
  manufacturer: string;
  batches: Batch[];
  status: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

export interface InventoryStats {
  totalMedicines: number;
  totalStock: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
}