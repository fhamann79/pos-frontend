import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CheckoutRequest } from '../models/checkout-request.model';
import { Sale } from '../models/sale.model';
import { SaleItem } from '../models/sale-item.model';
import { SaleListItem } from '../models/sale-list-item.model';
import { VoidSaleRequest } from '../models/void-sale.model';

@Injectable({ providedIn: 'root' })
export class PosWorkstationService {
  private readonly http = inject(HttpClient);
  private readonly salesUrl = `${environment.apiUrl}/api/Sales`;

  getSales(): Observable<SaleListItem[]> {
    return this.http.get<unknown[]>(this.salesUrl).pipe(map((rows) => rows.map((row) => this.toSaleListItem(row))));
  }

  getSaleDetail(id: number): Observable<Sale> {
    return this.http.get<unknown>(`${this.salesUrl}/${id}`).pipe(map((row) => this.toSale(row)));
  }

  createSale(payload: CheckoutRequest): Observable<unknown> {
    return this.http.post<unknown>(this.salesUrl, payload);
  }

  voidSale(id: number, payload: VoidSaleRequest): Observable<unknown> {
    return this.http.post<unknown>(`${this.salesUrl}/${id}/void`, payload);
  }

  resolveBusinessError(error: HttpErrorResponse): string {
    const code = this.readErrorCode(error);

    if (code === 'INSUFFICIENT_STOCK') {
      return 'Stock insuficiente para completar la venta.';
    }

    if (code === 'PRODUCT_NOT_FOUND') {
      return 'Uno de los productos ya no existe.';
    }

    if (code === 'INVALID_QUANTITY') {
      return 'Hay cantidades inválidas en el carrito.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }

    return 'No se pudo completar la acción. Intenta nuevamente.';
  }

  private toSaleListItem(source: unknown): SaleListItem {
    const row = this.asRecord(source);

    return {
      id: this.readNumber(row, ['id', 'saleId'], 0),
      createdAt: this.readString(row, ['createdAt', 'createdOn', 'date'], ''),
      status: this.readString(row, ['status'], 'UNKNOWN'),
      total: this.readNumber(row, ['total', 'grandTotal'], 0),
      createdBy: this.readString(row, ['createdBy', 'username', 'userName'], null),
      isVoided: this.readBoolean(row, ['isVoided', 'voided'], false),
    };
  }

  private toSale(source: unknown): Sale {
    const row = this.asRecord(source);
    const itemsRaw = row?.['items'];
    const items = Array.isArray(itemsRaw) ? itemsRaw.map((item) => this.toSaleItem(item)) : [];

    return {
      id: this.readNumber(row, ['id', 'saleId'], 0),
      createdAt: this.readString(row, ['createdAt', 'createdOn', 'date'], ''),
      status: this.readString(row, ['status'], 'UNKNOWN'),
      notes: this.readString(row, ['notes'], null),
      subtotal: this.readNumber(row, ['subtotal'], 0),
      total: this.readNumber(row, ['total', 'grandTotal'], 0),
      createdBy: this.readString(row, ['createdBy', 'username', 'userName'], null),
      isVoided: this.readBoolean(row, ['isVoided', 'voided'], false),
      items,
    };
  }

  private toSaleItem(source: unknown): SaleItem {
    const row = this.asRecord(source);

    return {
      productId: this.readNumber(row, ['productId', 'id'], 0),
      productName: this.readString(row, ['productName', 'name'], 'Producto'),
      quantity: this.readNumber(row, ['quantity'], 0),
      unitPrice: this.readNumber(row, ['unitPrice', 'price'], 0),
      subtotal: this.readNumber(row, ['subtotal', 'lineSubtotal'], 0),
    };
  }

  private readErrorCode(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }

    if (typeof error.error?.code === 'string') {
      return error.error.code;
    }

    return '';
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
  }

  private readString(record: Record<string, unknown> | null, keys: string[], fallback: string): string;
  private readString(record: Record<string, unknown> | null, keys: string[], fallback: null): string | null;
  private readString(record: Record<string, unknown> | null, keys: string[], fallback: string | null): string | null {
    if (!record) {
      return fallback;
    }

    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'string') {
        return value;
      }
    }

    return fallback;
  }

  private readBoolean(record: Record<string, unknown> | null, keys: string[], fallback: boolean): boolean {
    if (!record) {
      return fallback;
    }

    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'boolean') {
        return value;
      }
    }

    return fallback;
  }

  private readNumber(record: Record<string, unknown> | null, keys: string[], fallback: number): number {
    if (!record) {
      return fallback;
    }

    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return fallback;
  }
}
