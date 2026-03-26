import { SaleItemModel } from './sale-item.model';

export interface SaleModel {
  id: number;
  status: string;
  subtotal: number;
  total: number;
  notes?: string;
  companyId?: number;
  establishmentId?: number;
  emissionPointId?: number;
  userId?: number;
  username?: string;
  createdAt: string;
  items: SaleItemModel[];
}
