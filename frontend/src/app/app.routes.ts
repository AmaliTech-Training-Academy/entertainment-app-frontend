import { Routes } from '@angular/router';

export const routes: Routes = [
 {
    path: 'signup',
    loadComponent: () => import('./features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  }
];
