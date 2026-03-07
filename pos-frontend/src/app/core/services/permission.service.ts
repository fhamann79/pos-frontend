import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth';
import { AuthStore } from '../stores/auth.store';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const currentPermissions = this.getPermissions();
    return permissions.some((permission) => currentPermissions.includes(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    const currentPermissions = this.getPermissions();
    return permissions.every((permission) => currentPermissions.includes(permission));
  }

  private getPermissions(): string[] {
    const mePermissions = this.authStore.me()?.permissions;

    if (Array.isArray(mePermissions)) {
      return mePermissions;
    }

    return this.authService.getContext()?.permissions ?? [];
  }
}
