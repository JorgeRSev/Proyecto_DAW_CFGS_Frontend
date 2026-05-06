import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [Card],
  templateUrl: './packages.html',
})
export class Packages {
  constructor(private router: Router) {}

  packages = [
    {
      title: 'Básico',
      price: '20€',
      features: ['Baño', 'Secado'],
    },
    {
      title: 'Premium',
      price: '35€',
      features: ['Baño', 'Corte', 'Uñas'],
      popular: true,
    },
    {
      title: 'VIP',
      price: '50€',
      features: ['Baño y corte', 'Uñas y orejas', 'Glándulas', 'Ozono'],
    },
  ];

  goToBooking() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
