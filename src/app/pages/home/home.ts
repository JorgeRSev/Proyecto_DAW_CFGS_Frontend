import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Packages } from './components/packages/packages';
import { Faq } from './components/faq/faq';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Packages, Faq],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
