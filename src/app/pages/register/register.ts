import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
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

  private apiUrl = 'http://localhost/pelupatas/backend/src/api/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  nextStep() {
    if (this.registrarMascota) {
      this.step = 2;
    } else {
      this.onSubmit();
    }
  }

  backStep() {
    this.step = 1;
  }

  onSubmit() {
    const body: any = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    if (this.registrarMascota) {
      body.mascota = {
        nombre: this.nombreMascota,
        raza: this.raza,
        edad: this.edad,
        observaciones: this.observaciones
      };
    }

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: () => {
        this.errorMsg = 'Error de conexión con el servidor.';
      }
    });
  }
}