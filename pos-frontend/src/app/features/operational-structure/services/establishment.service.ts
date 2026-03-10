import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStore } from '../../../core/stores/auth.store';
import {
  CreateEstablishmentRequest,
  Establishment,
  UpdateEstablishmentRequest,
} from '../models/establishment.model';

@Injectable({ providedIn: 'root' })
export class EstablishmentService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/api/Establishments`;

  getAll(companyId: number) {
    const params = new HttpParams().set('companyId', companyId);
    return this.http
      .get<Establishment[]>(this.baseUrl, { params })
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  create(payload: CreateEstablishmentRequest) {
    return this.http
      .post<Establishment>(this.baseUrl, payload)
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  update(id: number, payload: UpdateEstablishmentRequest) {
    return this.http
      .put<Establishment>(`${this.baseUrl}/${id}`, payload)
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError((error) => this.handleAuthError(error)));
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authStore.clear();
      this.router.navigateByUrl('/login');
    }

    return throwError(() => error);
  }
}
