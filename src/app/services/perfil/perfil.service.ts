import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}?perfil=1`);
  }

  actualizarPerfil(data: { nombre: string; email: string; telefono: string }): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<any> {
    return this.http.put(this.apiUrl, {
      password_actual: passwordActual,
      password_nueva: passwordNueva,
    });
  }
}
