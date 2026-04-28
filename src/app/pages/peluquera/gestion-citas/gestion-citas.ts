import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CitasService, Cita } from '../../../services/citas/citas.service';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-citas.html',
})
export class GestionCitas implements OnInit {
  citas: Cita[] = [];
  cargando: boolean = true;
  error: string = '';
  actualizandoId: number | null = null;
  mensajeExito: string = '';

  readonly estados = ['pendiente', 'confirmada', 'cancelada', 'completada'];

  private userId: number;
  private userRol: string;

  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(
    private citasService: CitasService,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.userId = this.authService.getUser()?.id;
    this.userRol = this.authService.getUser()?.rol;
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    const peticion =
      this.userRol === 'admin'
        ? this.citasService.getAllCitas()
        : this.citasService.getMisCitasPeluquera();

    peticion.subscribe({
      next: (res) => {
        this.citas = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las citas.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  puedeEditar(cita: Cita): boolean {
    if (this.userRol === 'admin') return true;
    return cita.id_peluquera === this.userId;
  }

  cambiarEstado(cita: Cita, nuevoEstado: string): void {
    if (cita.estado === nuevoEstado) return;
    if (!this.puedeEditar(cita)) return;

    this.actualizandoId = cita.id;
    this.mensajeExito = '';

    this.http.put<any>(`${this.apiUrl}/${cita.id}`, { estado: nuevoEstado }).subscribe({
      next: (res) => {
        if (res.success) {
          cita.estado = nuevoEstado as Cita['estado'];
          this.mensajeExito = `Estado de ${cita.mascota} actualizado a "${nuevoEstado}"`;
          setTimeout(() => {
            this.mensajeExito = '';
            this.cdr.detectChanges();
          }, 3000);
        }
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al actualizar el estado.';
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  getBadgeClasses(estado: string): string {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    switch (estado) {
      case 'confirmada':
        return `${base} bg-green-100 text-green-700`;
      case 'pendiente':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'cancelada':
        return `${base} bg-red-100 text-red-700`;
      case 'completada':
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  }
}
