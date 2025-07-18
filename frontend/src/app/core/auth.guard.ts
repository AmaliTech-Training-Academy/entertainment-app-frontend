import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  // Parse cookies to check for auth_token
  const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  const token = cookies['auth_token'];
  if (token) {
    return true;
  } else {
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
};
