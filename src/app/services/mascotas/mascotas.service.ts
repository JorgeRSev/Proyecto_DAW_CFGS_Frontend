import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  observaciones?: string;
}

export interface Peluquera {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMisMascotas(): Observable<{ success: boolean; data: Mascota[] }> {
    return this.http.get<{ success: boolean; data: Mascota[] }>(`${this.apiUrl}/mascotas`);
  }

  getPeluqueras(): Observable<{ success: boolean; data: Peluquera[] }> {
    return this.http.get<{ success: boolean; data: Peluquera[] }>(
      `${this.apiUrl}/usuarios?rol=peluquera`,
    );
  }

  crearMascota(data: {
    nombre: string;
    raza: string;
    edad: number;
    observaciones: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/mascotas`, data);
  }

  actualizarMascota(
    id: number,
    data: {
      nombre: string;
      raza: string;
      edad: number;
      observaciones: string;
    },
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/mascotas/${id}`, data);
  }
}
