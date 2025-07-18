import { CanActivateFn } from '@angular/router';

export const RoleGuard: CanActivateFn = (route, state) => {
  // Parse cookies to check for auth_token and auth_user
  const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  const token = cookies['auth_token'];
  const userStr = cookies['auth_user'];
  if (!token || !userStr) {
    window.location.href = '/login';
    return false;
  }
  try {
    const user = JSON.parse(decodeURIComponent(userStr));
    const requiredRole = route.data?.['role'];
    if (requiredRole && Array.isArray(user.roles) && user.roles.includes(requiredRole)) {
      return true;
    } else {
      window.location.href = '/login';
      return false;
    }
  } catch (e) {
    window.location.href = '/login';
    return false;
  }
}; 