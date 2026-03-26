import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStore } from '../../../core/stores/auth.store';
import { SaleListItemModel } from '../models/sale-list-item.model';
import { SaleModel } from '../models/sale.model';
import { VoidSaleModel } from '../models/void-sale.model';

interface CreateSaleRequest {
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  private readonly salesUrl = `${environment.apiUrl}/api/Sales`;

  getSales() {
    return this.http.get<SaleModel[]>(this.salesUrl).pipe(
      map((sales) => sales.map((sale) => this.toListItem(sale))),
      catchError((error) => this.handleAuthError(error))
    );
  }

  getSaleById(id: number) {
    return this.http.get<SaleModel>(`${this.salesUrl}/${id}`).pipe(catchError((error) => this.handleAuthError(error)));
  }

  createSale(payload: CreateSaleRequest) {
    return this.http.post<SaleModel>(this.salesUrl, payload).pipe(catchError((error) => this.handleAuthError(error)));
  }

  voidSale(id: number, payload: VoidSaleModel) {
    return this.http
      .post<void>(`${this.salesUrl}/${id}/void`, payload)
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  private toListItem(sale: SaleModel): SaleListItemModel {
    return {
      id: sale.id,
      status: sale.status,
      total: sale.total,
      createdAt: sale.createdAt,
      itemsCount: sale.items?.length ?? 0,
      userId: sale.userId,
      username: sale.username,
    };
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authStore.clear();
      this.router.navigateByUrl('/login');
    }

    return throwError(() => error);
  }
}
