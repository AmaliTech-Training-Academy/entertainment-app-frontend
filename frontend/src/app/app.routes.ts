import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

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
          import('./features/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'movie/:id',
        loadComponent: () =>
          import('./pages/home/detail-page/detail.page').then(
            (m) => m.DetailPage,
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
            (m) => m.ForYouComponent,
          ),
      },
      // Add other main routes here
    ],
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./pages/auth-user/auth-user.component').then(
        (m) => m.AuthUserComponent,
      ),
  },
  {
    path: 'recommendation',
    loadComponent: () =>
      import('./components/recommendation/recommendation.component').then(
        (m) => m.RecommendationComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin-user/admin-user.component').then(
            (m) => m.AdminUserComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
