export interface SaleListItemModel {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  itemsCount: number;
  userId?: number;
  username?: string;
}
