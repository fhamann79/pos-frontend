import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeResponse } from '../models/me';
import { AuthContext } from '../models/auth-context';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7096/api/auth';

  private authContextKey = 'auth_context';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.api}/login`, { username, password });
  }

  me() {
    return this.http.get<MeResponse>(`${this.api}/me`);
  }

  // 👇 Logout aquí NO toca store. Solo limpia "cosas del servicio" si quieres.
  clearContext() {
    localStorage.removeItem(this.authContextKey);
  }

  saveContext(me: MeResponse) {
    const context: AuthContext = {
      userId: me.userId,
      username: me.username,
      companyId: me.companyId,
      establishmentId: me.establishmentId,
      emissionPointId: me.emissionPointId,
    };
    localStorage.setItem(this.authContextKey, JSON.stringify(context));
  }

  getContext(): AuthContext | null {
    const raw = localStorage.getItem(this.authContextKey);
    return raw ? JSON.parse(raw) : null;
  }
}
