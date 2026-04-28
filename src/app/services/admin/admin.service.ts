import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'admin' | 'peluquera' | 'cliente';
  activo: number;
}

export interface Estadisticas {
  usuarios: {
    cliente?: number;
    peluquera?: number;
    admin?: number;
  };
  citas: {
    pendiente?: number;
    confirmada?: number;
    cancelada?: number;
    completada?: number;
  };
  citas_este_mes: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<{ success: boolean; data: Estadisticas }> {
    return this.http.get<{ success: boolean; data: Estadisticas }>(`${this.apiUrl}?stats=1`);
  }

  getUsuarios(): Observable<{ success: boolean; data: Usuario[] }> {
    return this.http.get<{ success: boolean; data: Usuario[] }>(this.apiUrl);
  }

  crearUsuario(data: {
    nombre: string;
    email: string;
    telefono?: string;
    password: string;
    rol: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  toggleActivo(id: number, activo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { activo });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
