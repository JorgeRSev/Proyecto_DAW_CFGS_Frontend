import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService, Cita } from '../../services/citas/citas.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit {
  citas: Cita[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(
    private citasService: CitasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    this.citasService.getMisCitas().subscribe({
      next: (res) => {
        this.citas = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las citas. Inténtalo de nuevo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  getBadgeClasses(estado: string): string {
    const base = 'px-3 py-1 rounded-full text-sm font-medium';
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
