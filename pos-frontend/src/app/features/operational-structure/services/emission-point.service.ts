import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStore } from '../../../core/stores/auth.store';
import {
  CreateEmissionPointRequest,
  EmissionPoint,
  UpdateEmissionPointRequest,
} from '../models/emission-point.model';

@Injectable({ providedIn: 'root' })
export class EmissionPointService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/api/EmissionPoints`;

  getAll(establishmentId: number) {
    const params = new HttpParams().set('establishmentId', establishmentId);
    return this.http
      .get<EmissionPoint[]>(this.baseUrl, { params })
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  create(payload: CreateEmissionPointRequest) {
    return this.http
      .post<EmissionPoint>(this.baseUrl, payload)
      .pipe(catchError((error) => this.handleAuthError(error)));
  }

  update(id: number, payload: UpdateEmissionPointRequest) {
    return this.http
      .put<EmissionPoint>(`${this.baseUrl}/${id}`, payload)
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
