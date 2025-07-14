import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('../app/pages/home/home.page').then(m => m.HomePage)
  // },
  // {
  //   path: 'about',
  //   loadComponent: () => import('../features/about/about.component').then(m => m.AboutComponent)
  // },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
];
