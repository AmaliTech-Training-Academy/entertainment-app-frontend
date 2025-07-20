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
        loadComponent: () => import('./pages/home/home.page.component').then((m) => m.HomePage),
      },
      {
        path: 'media/detail/:id',
        loadComponent: () => import('./pages/detail-page/detail.page').then((m) => m.DetailPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'search/advanced',
        loadComponent: () =>
          import('./pages/advanced-search.page/advanced-search.page.component').then(
            (m) => m.AdvancedSearchPageComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'recommendations/for-you',
        loadComponent: () =>
          import('./pages/for-you.page.component').then((m) => m.ForYouComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./components/recommendation/recommendation.component').then(
            (m) => m.RecommendationComponent,
          ),
      },
      {
        path: 'media/:id/player',
        loadComponent: () =>
          import('./pages/media-player-page/media-player-page.component').then(
            (m) => m.MediaPlayerPageComponent,
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./pages/user-layout/user-layout.component').then((m) => m.UserLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/user-dashboard.page.component').then((m) => m.UserDashboardPageComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [RoleGuard],
    data: { role: 'ROLE_ADMINISTRATOR' },
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
          import('./features/admin-user/admin-user.component').then((m) => m.AdminUserComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./features/admin-content/admin-content.component').then(
            (m) => m.AdminContentComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then((m) => m.NotFoundComponent),
  },
];
