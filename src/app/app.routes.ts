import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.CATEGORY_ROUTES),
      },
      {
        path: 'movements',
        loadChildren: () =>
          import('./features/movements/movements.routes').then((m) => m.MOVEMENT_ROUTES),
      },
      {
        path: 'alerts',
        loadChildren: () => import('./features/alerts/alerts.routes').then((m) => m.ALERT_ROUTES),
      },
      {
        path: 'users',
        canActivate: [roleGuard('admin')],
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USER_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: 'dashboard' },
];
