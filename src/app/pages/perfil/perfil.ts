import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { PerfilService } from '../../services/perfil/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  user: any = null;

  editando: boolean = false;
  editNombre: string = '';
  editEmail: string = '';
  editTelefono: string = '';
  guardandoPerfil: boolean = false;
  errorPerfil: string = '';
  exitoPerfil: string = '';

  passwordActual: string = '';
  passwordNueva: string = '';
  passwordConfirmar: string = '';
  guardandoPass: boolean = false;
  errorPass: string = '';
  exitoPass: string = '';

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        this.user = res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.user = this.authService.getUser();
        this.cdr.detectChanges();
      },
    });
  }

  abrirEdicion(): void {
    this.editNombre = this.user?.nombre ?? '';
    this.editEmail = this.user?.email ?? '';
    this.editTelefono = this.user?.telefono ?? '';
    this.errorPerfil = '';
    this.exitoPerfil = '';
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.errorPerfil = '';
  }

  guardarPerfil(): void {
    this.errorPerfil = '';
    this.exitoPerfil = '';

    if (!this.editNombre.trim() || !this.editEmail.trim()) {
      this.errorPerfil = 'El nombre y el email son obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editEmail)) {
      this.errorPerfil = 'Introduce un email válido.';
      return;
    }

    if (this.editTelefono && !/^[\d\s\+\-\(\)]{6,20}$/.test(this.editTelefono)) {
      this.errorPerfil = 'El teléfono no tiene un formato válido.';
      return;
    }

    this.guardandoPerfil = true;

    this.perfilService
      .actualizarPerfil({
        nombre: this.editNombre.trim(),
        email: this.editEmail.trim(),
        telefono: this.editTelefono.trim(),
      })
      .subscribe({
        next: (res) => {
          this.guardandoPerfil = false;
          if (res.success) {
            this.user = res.usuario;

            localStorage.setItem(
              'usuario',
              JSON.stringify({
                ...this.authService.getUser(),
                nombre: res.usuario.nombre,
                email: res.usuario.email,
                telefono: res.usuario.telefono,
              }),
            );
            this.exitoPerfil = 'Perfil actualizado correctamente.';
            this.editando = false;
          } else {
            this.errorPerfil = res.message ?? 'Error al actualizar el perfil.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardandoPerfil = false;
          this.errorPerfil = err.error?.message ?? 'Error de conexión.';
          this.cdr.detectChanges();
        },
      });
  }
  get passwordsCoinciden(): boolean {
    return this.passwordNueva === this.passwordConfirmar;
  }

  cambiarPassword(): void {
    this.errorPass = '';
    this.exitoPass = '';

    if (!this.passwordActual || !this.passwordNueva || !this.passwordConfirmar) {
      this.errorPass = 'Rellena todos los campos.';
      return;
    }
    if (this.passwordNueva.length < 6) {
      this.errorPass = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (!this.passwordsCoinciden) {
      this.errorPass = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    if (this.passwordActual === this.passwordNueva) {
      this.errorPass = 'La nueva contraseña debe ser diferente a la actual.';
      return;
    }

    this.guardandoPass = true;

    this.perfilService.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: (res) => {
        this.guardandoPass = false;
        if (res.success) {
          this.exitoPass = 'Contraseña actualizada correctamente.';
          this.passwordActual = '';
          this.passwordNueva = '';
          this.passwordConfirmar = '';
        } else {
          this.errorPass = res.message ?? 'Error al actualizar la contraseña.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardandoPass = false;
        this.errorPass = err.error?.message ?? 'Error de conexión.';
        this.cdr.detectChanges();
      },
    });
  }
}
