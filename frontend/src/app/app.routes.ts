import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },
 {
    path: 'signup',
    loadComponent: () => import('../app/features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  }
];
