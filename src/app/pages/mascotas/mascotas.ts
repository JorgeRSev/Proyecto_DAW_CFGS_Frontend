import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotasService, Mascota } from '../../services/mascotas/mascotas.service';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.html',
})
export class Mascotas implements OnInit {
  mascotas: Mascota[] = [];
  cargando: boolean = true;
  error: string = '';

  modalAbierto: boolean = false;
  mascotaEditando: Mascota | null = null;

  formNombre: string = '';
  formRaza: string = '';
  formEdad: number | null = null;
  formObservaciones: string = '';

  guardando: boolean = false;
  errorModal: string = '';

  constructor(
    private mascotasService: MascotasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.error = '';

    this.mascotasService.getMisMascotas().subscribe({
      next: (res) => {
        this.mascotas = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las mascotas.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalNueva(): void {
    this.mascotaEditando = null;
    this.formNombre = '';
    this.formRaza = '';
    this.formEdad = null;
    this.formObservaciones = '';
    this.errorModal = '';
    this.modalAbierto = true;
  }

  abrirModalEditar(mascota: Mascota): void {
    this.mascotaEditando = mascota;
    this.formNombre = mascota.nombre;
    this.formRaza = mascota.raza;
    this.formEdad = mascota.edad;
    this.formObservaciones = mascota.observaciones ?? '';
    this.errorModal = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.mascotaEditando = null;
    this.errorModal = '';
    this.cdr.detectChanges();
  }

  guardar(): void {
    this.errorModal = '';

    if (!this.formNombre.trim()) {
      this.errorModal = 'El nombre es obligatorio.';
      return;
    }
    if (!this.formRaza.trim()) {
      this.errorModal = 'La raza es obligatoria.';
      return;
    }
    if (this.formEdad === null || this.formEdad < 0) {
      this.errorModal = 'Introduce una edad válida.';
      return;
    }

    this.guardando = true;

    const body = {
      nombre: this.formNombre.trim(),
      raza: this.formRaza.trim(),
      edad: this.formEdad,
      observaciones: this.formObservaciones.trim(),
    };

    const peticion = this.mascotaEditando
      ? this.mascotasService.actualizarMascota(this.mascotaEditando.id, body)
      : this.mascotasService.crearMascota(body);

    peticion.subscribe({
      next: (res) => {
        this.guardando = false;
        if (res.success) {
          this.cerrarModal();
          this.cargarMascotas();
        } else {
          this.errorModal = res.message ?? 'Error al guardar la mascota.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.guardando = false;
        this.errorModal = err.error?.message ?? 'Error de conexión con el servidor.';
        this.cdr.detectChanges();
      },
    });
  }

  get tituloModal(): string {
    return this.mascotaEditando ? `Editar ${this.mascotaEditando.nombre}` : 'Añadir mascota';
  }
}
