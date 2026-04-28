import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  step: number = 1;

  nombre: string = '';
  email: string = '';
  password: string = '';

  registrarMascota: boolean = false;
  nombreMascota: string = '';
  raza: string = '';
  edad: number | null = null;
  observaciones: string = '';

  errorMsg: string = '';
  guardando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  nextStep(): void {
    this.errorMsg = '';
    if (this.registrarMascota) {
      this.step = 2;
    } else {
      this.onSubmit();
    }
  }

  backStep(): void {
    this.step = 1;
  }

  onSubmit(): void {
    this.errorMsg = '';
    this.guardando = true;

    const body: any = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
    };

    if (this.registrarMascota) {
      body.mascota = {
        nombre: this.nombreMascota,
        raza: this.raza,
        edad: this.edad,
        observaciones: this.observaciones,
      };
    }

    this.authService.register(body).subscribe({
      next: (res) => {
        this.guardando = false;
        if (res.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMsg = res.message ?? 'Error al registrar el usuario.';
        }
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.message ?? 'Error de conexión con el servidor.';
      },
    });
  }
}
