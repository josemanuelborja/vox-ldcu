import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (token) {
    return true; 
  }

  router.navigate(['/login']); 
  return false;
};

export const adminGuard = () => {
  const router = inject(Router);
  const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  if (user.role === 'admin') {
    return true; 
  }

  router.navigate(['/login']);
  return false;
};