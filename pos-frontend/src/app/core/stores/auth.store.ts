import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../services/auth';
import { MeResponse } from '../models/me';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private auth = inject(AuthService);

  // Estado
  private _me = signal<MeResponse | null>(null);
  private _loaded = signal(false);

  // Selectores (lo que el resto de la app consume)
  me = computed(() => this._me());
  loaded = computed(() => this._loaded());
  isAuthenticated = computed(() => !!localStorage.getItem('token'));

  // helpers (opcionales pero útiles)
  companyId = computed(() => this._me()?.companyId ?? null);
  establishmentId = computed(() => this._me()?.establishmentId ?? null);
  username = computed(() => this._me()?.username ?? null);

  /** Carga el contexto del usuario desde /api/auth/me */
  loadMe() {
    this._loaded.set(false);

    return this.auth.me().pipe(
      tap((res) => {
        this._me.set(res);
        this._loaded.set(true);
      }),
      catchError((err) => {
        // Si falla (401/403), limpiamos sesión
        this.clear();
        this._loaded.set(true);
        return of(null);
      })
    );
  }

  /** Limpia sesión: token + contexto */
  clear() {
    localStorage.removeItem('token');
    this.auth.clearContext(); // 👈 limpia auth_context
    this._me.set(null);
    this._loaded.set(false);
  }

}
