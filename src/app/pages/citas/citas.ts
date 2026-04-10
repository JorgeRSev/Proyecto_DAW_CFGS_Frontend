import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas {

  user: any;
  citas: any[] = [];

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    
    this.citas = [
      {
        fecha: '2026-01-10',
        hora: '10:00',
        mascota: 'Toby',
        estado: 'Confirmada'
      },
      {
        fecha: '2026-01-15',
        hora: '12:00',
        mascota: 'Luna',
        estado: 'Pendiente'
      }
    ];
  }
}