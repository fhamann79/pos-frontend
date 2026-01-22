import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { AuthStore } from '../../../core/stores/auth.store';


@Component({
  selector: 'app-login',
  standalone: true,   
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(
    private authService: AuthService, 
    private store: AuthStore,
    private router: Router
  ) {}

  probarLogin() {
    this.authService.login('admin', '1234').subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

        // 🔽 Carga el contexto
        this.store.loadMe().subscribe({
          next: () => {
            // 🚀 REDIRECCIÓN
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: err => console.error('LOGIN ERROR:', err)
    });
  }


  probarMe() {
    this.store.loadMe().subscribe();
  }


  logout() {
    this.store.clear();
    console.log('Logout ejecutado');
  }



}

