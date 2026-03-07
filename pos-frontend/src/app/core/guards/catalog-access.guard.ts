import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PERMISSIONS } from '../constants/permissions';
import { PermissionService } from '../services/permission.service';

export const catalogAccessGuard: CanActivateFn = () => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const canAccessCatalog = permissionService.hasAnyPermission([
    PERMISSIONS.catalogCategoriesRead,
    PERMISSIONS.catalogProductsRead,
  ]);

  if (canAccessCatalog) {
    return true;
  }

  return router.createUrlTree(['/dashboard'], {
    queryParams: { message: 'catalog-denied' },
  });
};
