import { Routes } from '@angular/router';

export const ALERT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./alert-list/alert-list').then((m) => m.AlertList),
  },
];
