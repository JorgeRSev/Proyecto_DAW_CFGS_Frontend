import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor( private authService: AuthService, private router: Router) {
 }

  onSubmit() {
    this.errorMsg = '';

    this.authService.login({email: this.email, password: this.password}).subscribe({
      next: (res: any) => {
        if (res.success) {
            this.redirectByRol(res.usuario.rol);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: () => {
        this.errorMsg = ("Error servidor");
      }
    });
  }

  private redirectByRol(rol:string){
    switch (rol) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'peluquera':
        this.router.navigate(['/peluquera']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}