import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard(['cliente'])],
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'citas',
        loadComponent: () => import('./pages/citas/citas').then((m) => m.Citas),
      },
      {
        path: 'mascotas',
        loadComponent: () => import('./pages/mascotas/mascotas').then((m) => m.Mascotas),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil),
      },
      {
        path: 'pedir-cita',
        loadComponent: () =>
          import('./pages/solicitarCita/solicitar-cita').then((m) => m.SolicitarCita),
      },
      { path: '', redirectTo: 'citas', pathMatch: 'full' },
    ],
  },

  {
    path: 'peluquera',
    canActivate: [authGuard, roleGuard(['peluquera', 'admin'])],
    loadComponent: () => import('./pages/peluquera/layout/layout').then((m) => m.PeluqueraLayout),
    children: [
      {
        path: 'citas',
        loadComponent: () =>
          import('./pages/peluquera/gestion-citas/gestion-citas').then((m) => m.GestionCitas),
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import('./pages/peluquera/calendario/calendario').then((m) => m.Calendario),
      },
      { path: '', redirectTo: 'citas', pathMatch: 'full' },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./pages/admin/estadisticas/estadisticas').then((m) => m.EstadisticasAdmin),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/admin/gestion-usuarios/gestion-usuarios').then((m) => m.GestionUsuarios),
      },
      { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./pages/error404/error404').then((m) => m.Error404),
  },
];