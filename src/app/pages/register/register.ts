import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  step: number = 1;

  nombre: string = '';
  email: string = '';
  password: string = '';

  nombreMascota: string = '';
  raza: string = '';
  edad: number | null = null;
  observaciones: string = '';

  registrarMascota: boolean = false;

  nextStep() {
    if(this.registrarMascota){
      this.step = 2;
    } else {
      this.onSubmit();
    }
  }

  backStep() {
    this.step = 1;
  }

  onSubmit() {
    console.log("Usuario:", {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    });

    if(this.registrarMascota){
      console.log("Mascota:", {
        nombre: this.nombreMascota,
        raza: this.raza,
        edad: this.edad,
        observaciones: this.observaciones
      });
    }
  }

}