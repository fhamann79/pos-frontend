export interface PosProductModel {
  id: number;
  productId: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
}
