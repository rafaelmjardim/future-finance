import { Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./domain/auth/pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./domain/transactions/pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'transacoes',
    loadComponent: () =>
      import('./domain/transactions/pages/transactions/transactions.component').then(
        (c) => c.TransactionsComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' }, //Error route
];
