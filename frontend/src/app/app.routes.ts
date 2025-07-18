import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';

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
        canActivate: [RoleGuard],
        data: { role: 'ROLE_AUTHENTICATED_USER' },
      },
      {
        path: 'movie/:id',
        loadComponent: () =>
          import('./pages/detail-page/detail.page').then(
            (m) => m.DetailPage,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile-page/profile-page.component').then(
            (m) => m.ProfilePageComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'advanced-search',
        loadComponent: () =>
          import(
            './pages/advanced-search.page/advanced-search.page.component'
          ).then((m) => m.AdvancedSearchPageComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'for-you',
        loadComponent: () =>
          import('./pages/for-you.page.component').then(
            (m) => m.ForYouComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'user-test',
        loadComponent: () =>
          import('./pages/user-dashboard.page.component').then(
            (m) => m.UserDashboardPageComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'media-player',
        loadComponent: () => import('./pages/media-player-page/media-player-page.component').then(m => m.MediaPlayerPageComponent),
        canActivate: [AuthGuard],
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
    canActivate: [RoleGuard],
    data: { role: 'admin' },
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
