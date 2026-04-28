import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.html',
})
export class Nav {
  user: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
