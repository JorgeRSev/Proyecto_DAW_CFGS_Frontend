import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../../services/admin/admin.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
})
export class GestionUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = true;
  error: string = '';
  filtroRol: string = '';

  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroRol) return this.usuarios;
    return this.usuarios.filter((u) => u.rol === this.filtroRol);
  }

  formAbierto: boolean = false;
  nuevoNombre: string = '';
  nuevoEmail: string = '';
  nuevoTelefono: string = '';
  nuevoPassword: string = '';
  nuevoRol: string = 'cliente';
  guardando: boolean = false;
  errorForm: string = '';

  usuarioAEliminar: Usuario | null = null;
  adminId: number;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.adminId = this.authService.getUser()?.id;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';
    this.adminService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirFormulario(): void {
    this.nuevoNombre = '';
    this.nuevoEmail = '';
    this.nuevoTelefono = '';
    this.nuevoPassword = '';
    this.errorForm = '';
    this.nuevoRol = 'cliente';
    this.formAbierto = true;
  }

  cerrarFormulario(): void {
    this.formAbierto = false;
    this.errorForm = '';
  }

  crearUsuario(): void {
    if (!this.nuevoNombre || !this.nuevoEmail || !this.nuevoPassword) {
      this.errorForm = 'Rellena los campos obligatorios.';
      return;
    }
    this.guardando = true;
    this.errorForm = '';

    this.adminService
      .crearUsuario({
        nombre: this.nuevoNombre,
        email: this.nuevoEmail,
        telefono: this.nuevoTelefono,
        password: this.nuevoPassword,
        rol: this.nuevoRol,
      })
      .subscribe({
        next: (res) => {
          this.guardando = false;
          if (res.success) {
            this.cerrarFormulario();
            this.cargarUsuarios();
          } else {
            this.errorForm = res.message ?? 'Error al crear el usuario.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardando = false;
          this.errorForm = err.error?.message ?? 'Error de conexión.';
          this.cdr.detectChanges();
        },
      });
  }

  toggleActivo(usuario: Usuario): void {
    const nuevoEstado = !usuario.activo;
    this.adminService.toggleActivo(usuario.id, nuevoEstado).subscribe({
      next: (res) => {
        if (res.success) {
          usuario.activo = nuevoEstado ? 1 : 0;
          this.cdr.detectChanges();
        }
      },
    });
  }

  pedirConfirmacion(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
  }

  cancelarEliminacion(): void {
    this.usuarioAEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioAEliminar) return;
    this.adminService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarios = this.usuarios.filter((u) => u.id !== this.usuarioAEliminar!.id);
          this.usuarioAEliminar = null;
          this.cdr.detectChanges();
        }
      },
    });
  }

  getRolBadge(rol: string): string {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    switch (rol) {
      case 'admin':
        return `${base} bg-red-100 text-red-700`;
      case 'peluquera':
        return `${base} bg-green-100 text-green-700`;
      case 'cliente':
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  }
}
