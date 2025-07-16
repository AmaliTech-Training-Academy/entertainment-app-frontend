import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/main-layout.component';
import { AuthLayoutComponent } from './features/auth/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.page.component').then((m) => m.HomePage),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page.component').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'movie/:id',
        loadComponent: () =>
          import('./pages/movie-details.page.component').then(
            (m) => m.MovieDetailsComponent
          ),
      },
      {
        path: 'advanced-search',
        loadComponent: () =>
          import(
            './pages/advanced-search.page/advanced-search.page.component'
          ).then((m) => m.AdvancedSearchPageComponent),
      },
      {
        path: 'for-you',
        loadComponent: () =>
          import('./pages/for-you.page.component').then(
            (m) => m.ForYouComponent
          ),
      },
      // Add other main routes here
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component').then(
            (m) => m.SignUpComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
];
