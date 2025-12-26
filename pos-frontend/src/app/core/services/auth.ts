import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private api = 'https://localhost:7096/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(
      `${this.api}/login`,
      { username, password }
    );
  }

  logout(): void {
  localStorage.removeItem('token');
}

}

