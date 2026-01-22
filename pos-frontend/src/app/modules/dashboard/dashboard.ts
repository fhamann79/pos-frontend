import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private store = inject(AuthStore);
  private router = inject(Router);

  me = this.store.me;
  loaded = this.store.loaded;

  ngOnInit() {
    // Solo carga si hay token
    if (this.store.isAuthenticated()) {
      this.store.loadMe().subscribe();
    }
  }

  logout() {
    this.store.clear();
    this.router.navigateByUrl('/login');
  }
}
