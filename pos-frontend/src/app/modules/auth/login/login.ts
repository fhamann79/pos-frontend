import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CardModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private authService: AuthService,
    private store: AuthStore,
    private router: Router,
  ) {}

  probarLogin() {
    this.authService.login('admin', '1234').subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.store.loadMe().subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
        });
      },
      error: (err) => console.error('LOGIN ERROR:', err),
    });
  }

  probarMe() {
    this.store.loadMe().subscribe();
  }

  logout() {
    this.store.clear();
  }
}
