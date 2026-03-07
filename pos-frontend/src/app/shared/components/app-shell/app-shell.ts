import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthStore } from '../../../core/stores/auth.store';
import { PermissionService } from '../../../core/services/permission.service';
import { PERMISSIONS } from '../../../core/constants/permissions';

interface MenuItem {
  label: string;
  icon: string;
  route: string | null;
  disabled: boolean;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);

  readonly sidebarCollapsed = signal(false);
  readonly me = this.store.me;
  readonly username = computed(() => this.me()?.username ?? 'Usuario');
  readonly roleLabel = computed(() => this.me()?.roleCode ?? 'Sin rol');

  readonly canReadCatalog = computed(() =>
    this.permissionService.hasAnyPermission([
      PERMISSIONS.catalogCategoriesRead,
      PERMISSIONS.catalogProductsRead,
    ])
  );

  readonly menuItems = computed<MenuItem[]>(() => {
    const baseItems: MenuItem[] = [
      { label: 'Dashboard', icon: 'pi pi-chart-line', route: '/dashboard', disabled: false },
      { label: 'Ventas', icon: 'pi pi-shopping-cart', route: null, disabled: true },
    ];

    if (this.canReadCatalog()) {
      baseItems.splice(1, 0, { label: 'Catálogo', icon: 'pi pi-box', route: '/catalog', disabled: false });
    }

    return baseItems;
  });

  toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  logout(): void {
    this.store.clear();
    this.router.navigateByUrl('/login');
  }
}
