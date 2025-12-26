import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,   
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private authService: AuthService) {}

  probarLogin() {
    this.authService.login('admin', '1234').subscribe(res => {
    localStorage.setItem('token', res.token);
    console.log('Token guardado');
    });
  }
  logout() {
    this.authService.logout();
    console.log('Logout ejecutado');
  }

}

