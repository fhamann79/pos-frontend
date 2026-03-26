import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStore } from '../../../core/stores/auth.store';
import { PosProductModel } from '../models/pos-product.model';

interface ProductResponse {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  isActive: boolean;
}

interface StockResponse {
  productId: number;
  productName?: string;
  quantity: number;
  categoryId?: number;
  categoryName?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PosProductService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  private readonly productsUrl = `${environment.apiUrl}/api/Products`;
  private readonly stocksUrl = `${environment.apiUrl}/api/Inventory/stocks`;

  getProducts() {
    return forkJoin({
      products: this.http.get<ProductResponse[]>(this.productsUrl),
      stocks: this.http.get<StockResponse[]>(this.stocksUrl).pipe(catchError(() => of([]))),
    }).pipe(
      map(({ products, stocks }) => this.toPosProducts(products, stocks)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  private toPosProducts(products: ProductResponse[], stocks: StockResponse[]): PosProductModel[] {
    const stockMap = new Map<number, StockResponse>();
    stocks.forEach((stock) => stockMap.set(stock.productId, stock));

    return products
      .filter((product) => product.isActive)
      .map((product) => {
        const stock = stockMap.get(product.id);

        return {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          stock: stock?.quantity ?? 0,
          categoryId: product.categoryId ?? stock?.categoryId ?? 0,
          categoryName: stock?.categoryName,
          isActive: product.isActive,
        };
      });
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authStore.clear();
      this.router.navigateByUrl('/login');
    }

    return throwError(() => error);
  }
}
