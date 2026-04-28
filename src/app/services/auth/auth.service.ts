import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      }),
    );
  }

  register(data: {
    nombre: string;
    email: string;
    password: string;
    mascota?: { nombre: string; raza: string; edad: number | null; observaciones: string };
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  getRol(): string | null {
    return this.getUser()?.rol ?? null;
  }

  hasRol(roles: string[]): boolean {
    const rol = this.getRol();
    return rol ? roles.includes(rol) : false;
  }
}
