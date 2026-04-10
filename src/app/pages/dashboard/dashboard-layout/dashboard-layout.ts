import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  imports: [RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {

  constructor(private authService: AuthService) {}

logout() {
  if (confirm('¿Seguro que quieres cerrar sesión?')) {
    this.authService.logout();
  }
}
}