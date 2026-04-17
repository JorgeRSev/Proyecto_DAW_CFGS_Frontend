import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload: any = jwtDecode(token);
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      router.navigate(['/login']);
      return false;
    }
    return true;

  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.navigate(['/login']);
    return false;
  }
};

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router      = inject(Router);
 
    if (authService.hasRol(rolesPermitidos)) {
      return true;
    }
    router.navigate(['/dashboard']);
    return false;
  };
};