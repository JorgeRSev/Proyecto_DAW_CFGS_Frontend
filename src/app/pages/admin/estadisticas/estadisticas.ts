import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Estadisticas } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
})
export class EstadisticasAdmin implements OnInit {
  stats: Estadisticas | null = null;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.adminService.getEstadisticas().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las estadísticas.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  sumar(obj: Record<string, number> | undefined): number {
    if (!obj) return 0;
    return Object.values(obj).reduce((acc, v) => acc + v, 0);
  }
}
