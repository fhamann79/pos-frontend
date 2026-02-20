import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private store = inject(AuthStore);
  private router = inject(Router);

  me = this.store.me;
  loaded = this.store.loaded;

  ngOnInit() {
    if (this.store.isAuthenticated()) {
      this.store.loadMe().subscribe();
    }
  }

  logout() {
    this.store.clear();
    this.router.navigateByUrl('/login');
  }
}
