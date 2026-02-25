import { Routes } from '@angular/router';

export const MOVEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./movement-list/movement-list').then((m) => m.MovementList),
  },
  {
    path: 'new',
    loadComponent: () => import('./movement-form/movement-form').then((m) => m.MovementForm),
  },
];
