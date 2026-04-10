import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto').then(m => m.Contacto)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },
{
  path: 'dashboard',
  loadComponent: () =>
    import('./pages/dashboard/dashboard')
      .then(m => m.Dashboard),

    canActivate: [authGuard],

    // children: [
    //   {
    //     path: 'home',
    //     loadComponent: () =>
    //       import('./dashboard/pages/home/home.component')
    //         .then(m => m.HomeComponent)
    //   },
    //   {
    //     path: 'citas',
    //     loadComponent: () =>
    //       import('./dashboard/pages/citas/citas.component')
    //         .then(m => m.CitasComponent)
    //   },
    //   {
    //     path: 'mascotas',
    //     loadComponent: () =>
    //       import('./dashboard/pages/mascotas/mascotas.component')
    //         .then(m => m.MascotasComponent)
    //   },
    //   {
    //     path: 'perfil',
    //     loadComponent: () =>
    //       import('./dashboard/pages/perfil/perfil.component')
    //         .then(m => m.PerfilComponent)
    //   },
    //   {
    //     path: 'calendario',
    //     loadComponent: () =>
    //       import('./dashboard/pages/calendario/calendario.component')
    //         .then(m => m.CalendarioComponent)
    //   },
    //   {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    //   }
    // ]
  }
];