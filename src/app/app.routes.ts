import { Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo } from "@angular/fire/auth-guard";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'transacoes',
        loadComponent: () => import('./pages/transitions/transitions.component').then(c => c.TransitionsComponent),
        canActivate: [AuthGuard]
    },
    {   path: '**', redirectTo: 'login' } //Error route
];
