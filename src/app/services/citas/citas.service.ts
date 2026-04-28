import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas: string | null;
  mascota: string;
  raza?: string;
  dueno?: string;
  telefono_dueno?: string;
  peluquera: string;
  id_peluquera?: number;
}

export interface MascotaConDueno {
  id: number;
  nombre: string;
  raza: string;
  dueno: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  getMisCitas(): Observable<{ success: boolean; data: Cita[] }> {
    return this.http.get<{ success: boolean; data: Cita[] }>(`${this.apiUrl}?mine=1`);
  }

  getAllCitas(): Observable<{ success: boolean; data: Cita[] }> {
    return this.http.get<{ success: boolean; data: Cita[] }>(this.apiUrl);
  }

  getMisCitasPeluquera(): Observable<{ success: boolean; data: Cita[] }> {
    return this.http.get<{ success: boolean; data: Cita[] }>(`${this.apiUrl}?mis-citas=1`);
  }

  getAllMascotasActivas(): Observable<{ success: boolean; data: MascotaConDueno[] }> {
    return this.http.get<{ success: boolean; data: MascotaConDueno[] }>(
      `${this.apiUrl}?mascotas-activas=1`,
    );
  }
}
