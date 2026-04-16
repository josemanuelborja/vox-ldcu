import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // If admin tries to access user pages → redirect to admin dashboard
  if (user.role === 'admin') {
    return router.createUrlTree(['/adminDashboard']);
  }

  return true;
};

export const adminGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  if (user.role !== 'admin') {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};

// IMPORTANT: para sa login/register pages
export const guestGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  if (token) {
    // kung naka login na → redirect based sa role
    if (user.role === 'admin') {
      return router.createUrlTree(['/adminDashboard']);
    } else {
      return router.createUrlTree(['/dashboard']);
    }
  }

  return true;
};