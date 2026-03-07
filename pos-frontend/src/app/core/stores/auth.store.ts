import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../services/auth';
import { MeResponse } from '../models/me';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private auth = inject(AuthService);

  private _me = signal<MeResponse | null>(null);
  private _loaded = signal(false);

  me = computed(() => this._me());
  loaded = computed(() => this._loaded());
  isAuthenticated = computed(() => !!localStorage.getItem('token'));

  companyId = computed(() => this._me()?.companyId ?? null);
  establishmentId = computed(() => this._me()?.establishmentId ?? null);
  emissionPointId = computed(() => this._me()?.emissionPointId ?? null);
  username = computed(() => this._me()?.username ?? null);
  roleCode = computed(() => this._me()?.roleCode ?? null);
  permissions = computed(() => this._me()?.permissions ?? []);

  loadMe() {
    this._loaded.set(false);

    return this.auth.me().pipe(
      tap((res) => {
        this._me.set(res);
        this.auth.saveContext(res);
        this._loaded.set(true);
      }),
      catchError(() => {
        this.clear();
        this._loaded.set(true);
        return of(null);
      })
    );
  }

  clear() {
    localStorage.removeItem('token');
    this.auth.clearContext();
    this._me.set(null);
    this._loaded.set(false);
  }
}
