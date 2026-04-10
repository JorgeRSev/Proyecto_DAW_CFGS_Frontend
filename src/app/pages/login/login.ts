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

  constructor( private authService: AuthService, private router: Router) {

  }

  onSubmit() {
    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          const token = res.token || res.data?.token || res.access_token;
          localStorage.setItem("token", res.token);
          localStorage.setItem("usuario", JSON.stringify(res.usuario));
          this.router.navigate(['/dashboard']);
        } else {
          alert(res.message);
        }
      },
      error: () => {
        alert("Error servidor");
      }
    });
  }
}